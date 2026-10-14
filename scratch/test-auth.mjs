// End-to-end Auth test script for Phase 1
async function runTests() {
  console.log('🧪 Starting Auth End-to-End Tests...');

  // 1. Get CSRF Token and Cookies
  const csrfRes = await fetch('http://localhost:3001/api/auth/csrf');
  const csrfCookies = csrfRes.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
  const { csrfToken } = await csrfRes.json();
  console.log('1. Got CSRF Token:', csrfToken);
  console.log('   CSRF Cookies:', csrfCookies);

  // Helper to test login
  async function testLogin(username, password) {
    const params = new URLSearchParams({
      csrfToken,
      username,
      password,
      redirect: 'false',
      callbackUrl: 'http://localhost:3001/dashboard',
      json: 'true',
    });

    const res = await fetch('http://localhost:3001/api/auth/callback/credentials', {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': csrfCookies,
      },
      body: params.toString(),
    });

    const setCookies = res.headers.getSetCookie();
    const cookieHeader = setCookies.map((c) => c.split(';')[0]).join('; ');
    const body = await res.json().catch(() => ({}));
    return { status: res.status, cookies: cookieHeader, setCookies, body };
  }

  // 2. Test Admin Login
  console.log('2. Testing Admin Login (admin / admin123)...');
  const adminLogin = await testLogin('admin', 'admin123');
  console.log('   Admin Login Status:', adminLogin.status);
  console.log('   Admin Cookies:', adminLogin.cookies);
  if (!adminLogin.cookies.includes('authjs.session-token')) {
    throw new Error('Admin login failed: no authjs.session-token in ' + adminLogin.cookies);
  }
  console.log('   ✅ Admin Login Succeeded with Session Token!');

  // 3. Test Admin accessing /admin
  console.log('3. Testing Admin accessing /admin...');
  const adminPageRes = await fetch('http://localhost:3001/admin', {
    headers: { Cookie: adminLogin.cookies },
    redirect: 'manual',
  });
  console.log('   Admin page status:', adminPageRes.status);
  if (adminPageRes.status === 200) {
    console.log('   ✅ Admin successfully accessed /admin (200 OK)');
  } else {
    throw new Error('Admin accessing /admin returned ' + adminPageRes.status);
  }

  // 4. Test Member Login
  console.log('4. Testing Member Login (member / member123)...');
  const memberLogin = await testLogin('member', 'member123');
  console.log('   Member Login Status:', memberLogin.status);
  console.log('   Member Cookies:', memberLogin.cookies);
  if (!memberLogin.cookies.includes('authjs.session-token')) {
    throw new Error('Member login failed: no authjs.session-token');
  }
  console.log('   ✅ Member Login Succeeded with Session Token!');

  // 5. Test Member accessing /dashboard
  console.log('5. Testing Member accessing /dashboard...');
  const memberDashRes = await fetch('http://localhost:3001/dashboard', {
    headers: { Cookie: memberLogin.cookies },
    redirect: 'manual',
  });
  console.log('   Member dashboard status:', memberDashRes.status);
  if (memberDashRes.status === 200) {
    console.log('   ✅ Member successfully accessed /dashboard (200 OK)');
  } else {
    throw new Error('Member accessing /dashboard returned ' + memberDashRes.status);
  }

  // 6. Test Member trying to access /admin (Should be blocked / redirected to /dashboard)
  console.log('6. Testing Member trying to access /admin...');
  const memberAdminRes = await fetch('http://localhost:3001/admin', {
    headers: { Cookie: memberLogin.cookies },
    redirect: 'manual',
  });
  console.log('   Member access /admin status:', memberAdminRes.status, 'Location:', memberAdminRes.headers.get('location'));
  if (
    memberAdminRes.status === 307 ||
    memberAdminRes.status === 302 ||
    memberAdminRes.headers.get('location')?.includes('/dashboard')
  ) {
    console.log('   ✅ Member blocked from /admin and redirected to /dashboard!');
  } else {
    throw new Error('Member was not blocked from /admin: status ' + memberAdminRes.status);
  }

  // 7. Test Invalid Login
  console.log('7. Testing Invalid Login (wrong password)...');
  const invalidLogin = await testLogin('admin', 'wrongpassword');
  console.log('   Invalid login cookies:', invalidLogin.cookies);
  if (!invalidLogin.cookies.includes('authjs.session-token')) {
    console.log('   ✅ Invalid password rejected as expected (no session token)!');
  } else {
    throw new Error('Invalid login unexpectedly succeeded');
  }

  console.log('\n🎉🎉🎉 ALL PHASE 1 AUTH TESTS PASSED 100%! 🎉🎉🎉');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
