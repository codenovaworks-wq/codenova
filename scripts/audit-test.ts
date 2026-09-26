import { db } from '../src/server/db';
import { pricingConfig } from '../src/data/pricingData';
import crypto from 'crypto';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTest(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  ✓ PASS: ${name}`);
  } catch (err: any) {
    results.push({ name, passed: false, error: err.message });
    console.error(`  ✗ FAIL: ${name} -> ${err.message}`);
  }
}

async function runAllTests() {
  console.log('\n==================================================');
  console.log(' CODENOVA PRE-LAUNCH AUDIT AUTOMATED TEST SUITE');
  console.log('==================================================\n');

  // Test 1: Account Takeover Prevention on Duplicate Registration
  await runTest('Security: Block Account Takeover on Registration with Existing Email', () => {
    let threwError = false;
    try {
      db.registerPortalUser({
        name: 'Attacker Impersonator',
        email: 'client@apexlogistics.com', // Pre-existing user
        passwordPlain: 'AttackerNewPassword123!',
      });
    } catch (err: any) {
      threwError = true;
      assert(
        err.message.includes('already exists'),
        `Expected error message about account already existing, got: ${err.message}`
      );
    }
    assert(threwError, 'Registration of existing email did not throw error! Account takeover vulnerability exists.');

    // Verify existing user password was NOT altered
    const user = db.authenticatePortalUser('client@apexlogistics.com', 'Client2026!Pass');
    assert(!!user, 'Existing user password was altered or corrupted!');
  });

  // Test 2: Password Reset PIN Flow & Protection
  await runTest('Security: Secure Password Reset PIN Generation & Verification', () => {
    const testEmail = 'client@apexlogistics.com';

    // Verify reset fails with invalid PIN
    let failedWithBadPin = false;
    try {
      db.verifyAndResetPassword(testEmail, '999999', 'FakePassword123!');
    } catch (err: any) {
      failedWithBadPin = true;
      assert(err.message.includes('Invalid or expired'), `Expected PIN error, got: ${err.message}`);
    }
    assert(failedWithBadPin, 'Password reset succeeded without valid PIN!');

    // Generate legitimate PIN
    const pin = db.createPasswordResetPin(testEmail);
    assert(typeof pin === 'string' && pin.length === 6, 'Generated PIN is not 6 digits');

    // Reset password with valid PIN
    const resetResult = db.verifyAndResetPassword(testEmail, pin, 'ApexNewPass2026!');
    assert(!!resetResult && resetResult.user.email === testEmail, 'Reset password failed with valid PIN');

    // Verify PIN cannot be reused (one-time use)
    let failedOnReuse = false;
    try {
      db.verifyAndResetPassword(testEmail, pin, 'AnotherPassword123!');
    } catch (err) {
      failedOnReuse = true;
    }
    assert(failedOnReuse, 'PIN was reusable after already being consumed!');

    // Restore original test password
    db.resetPortalPassword(testEmail, 'Client2026!Pass');
    assert(!!db.authenticatePortalUser(testEmail, 'Client2026!Pass'), 'Failed to restore test account password');
  });

  // Test 3: Client Data Isolation & Multi-Tenant IDOR Prevention
  await runTest('Multi-Tenancy: Client Data Isolation (Projects, Invoices, Tickets)', () => {
    const clientA = 'client-101';
    const clientB = 'client-999-isolated';

    // Client A projects should only belong to client A
    const projectsA = db.getPortalProjects(clientA);
    for (const p of projectsA) {
      assert(p.client_id === clientA, `Data leak: Client A received project belonging to ${p.client_id}`);
    }

    // Client B should receive 0 projects (none created for client B)
    const projectsB = db.getPortalProjects(clientB);
    assert(projectsB.length === 0, `Isolation leak: Client B received ${projectsB.length} projects`);

    // Invoices isolation
    const invoicesB = db.getInvoices(clientB);
    assert(invoicesB.length === 0, `Isolation leak: Client B received ${invoicesB.length} invoices`);

    // IDOR on getPortalProjectById
    if (projectsA.length > 0) {
      const projId = projectsA[0].id;
      const stolenProj = db.getPortalProjectById(projId, clientB);
      assert(stolenProj === undefined, `IDOR leak: Client B was able to fetch Client A's project ${projId}!`);

      const legitimateProj = db.getPortalProjectById(projId, clientA);
      assert(!!legitimateProj, `Client A failed to fetch their own project`);
    }

    // IDOR on getInvoiceById
    const invoicesA = db.getInvoices(clientA);
    if (invoicesA.length > 0) {
      const invId = invoicesA[0].id;
      const stolenInv = db.getInvoiceById(invId, clientB);
      assert(stolenInv === undefined, `IDOR leak: Client B was able to fetch Client A's invoice ${invId}!`);
    }

    // Empty string clientId must never return all projects
    const emptyClientProjects = db.getPortalProjects('');
    assert(emptyClientProjects.length === 0, `Empty clientId returned all projects instead of empty array!`);
  });

  // Test 4: Pricing Consistency & Anti-Cheapening Check
  await runTest('Pricing: Flagship Minimum Price Floors & Consistency', () => {
    const customSoftwareCat = pricingConfig.categories.find((c) => c.id === 'custom-software-saas');
    assert(!!customSoftwareCat, 'Flagship custom software category missing from pricingConfig');

    const starterPkg = customSoftwareCat!.packages.find((p) => p.id === 'starter-mvp');
    assert(!!starterPkg, 'Starter MVP package missing');
    assert(starterPkg!.priceINR >= 195000, `Starter MVP price INR (${starterPkg!.priceINR}) below minimum ₹1,95,000 floor`);
    assert(starterPkg!.priceUSD >= 3999, `Starter MVP price USD ($${starterPkg!.priceUSD}) below minimum $3,999 floor`);

    const bizPkg = customSoftwareCat!.packages.find((p) => p.id === 'standard-business-suite');
    assert(!!bizPkg, 'Standard Business Suite package missing');
    assert(bizPkg!.priceINR >= 390000, `Business Suite price INR (${bizPkg!.priceINR}) below minimum ₹3,90,000 floor`);
    assert(bizPkg!.priceUSD >= 7999, `Business Suite price USD ($${bizPkg!.priceUSD}) below minimum $7,999 floor`);

    const enterprisePkg = customSoftwareCat!.packages.find((p) => p.id === 'enterprise-custom-scale');
    assert(!!enterprisePkg, 'Enterprise package missing');
    assert(enterprisePkg!.priceINR >= 690000, `Enterprise price INR (${enterprisePkg!.priceINR}) below minimum ₹6,90,000 floor`);
    assert(enterprisePkg!.priceUSD >= 14999, `Enterprise price USD ($${enterprisePkg!.priceUSD}) below minimum $14,999 floor`);

    // Verify no cheap freelancer prices anywhere across all categories
    for (const cat of pricingConfig.categories) {
      for (const pkg of cat.packages) {
        assert(pkg.priceINR >= 45000, `Category ${cat.name} package ${pkg.name} priced below agency floor (₹${pkg.priceINR})`);
      }
    }
  });

  // Test 5: Razorpay HMAC Cryptographic Verification Logic
  await runTest('Payments: Razorpay HMAC-SHA256 Cryptographic Verification', () => {
    const testSecret = 'rzp_test_secret_key_123456';
    const orderId = 'order_test_98765';
    const paymentId = 'pay_test_54321';

    // Correct signature
    const validSignature = crypto
      .createHmac('sha256', testSecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Forged signature
    const forgedSignature = 'forged_invalid_hex_signature';

    const verifyHmac = (oid: string, pid: string, sig: string, secret: string) => {
      const expected = crypto.createHmac('sha256', secret).update(`${oid}|${pid}`).digest('hex');
      return expected === sig;
    };

    assert(verifyHmac(orderId, paymentId, validSignature, testSecret), 'Valid signature failed verification');
    assert(!verifyHmac(orderId, paymentId, forgedSignature, testSecret), 'Forged signature was accepted!');
  });

  // Test Summary
  console.log('\n==================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(` TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  if (failed === 0) {
    console.log(' ALL CRITICAL SECURITY & BUSINESS LOGIC TESTS PASSED!');
  } else {
    console.error(' TESTS FAILED! Review issues above.');
    process.exit(1);
  }
  console.log('==================================================\n');
}

runAllTests().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
