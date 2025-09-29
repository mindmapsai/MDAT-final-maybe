const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3002/api';

class APITester {
  constructor() {
    this.tokens = {};
    this.testResults = [];
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logMessage);
    this.testResults.push({ timestamp, type, message });
  }

  async makeRequest(method, endpoint, data = null, token = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json().catch(() => ({}));
      
      return {
        status: response.status,
        ok: response.ok,
        data: responseData
      };
    } catch (error) {
      return {
        status: 0,
        ok: false,
        error: error.message
      };
    }
  }

  async testHealthCheck() {
    await this.log('Testing health check endpoint...');
    const result = await this.makeRequest('GET', '/health');
    
    if (result.ok) {
      await this.log('✅ Health check passed', 'success');
      return true;
    } else {
      await this.log('❌ Health check failed', 'error');
      return false;
    }
  }

  async testAuthentication() {
    await this.log('Testing authentication endpoints...');
    
    // Test signup for different departments
    const testUsers = [
      { name: 'HR Test User', email: 'hr@test.com', password: 'test123', department: 'HR' },
      { name: 'Tech Test User', email: 'tech@test.com', password: 'test123', department: 'Tech' },
      { name: 'Finance Test User', email: 'finance@test.com', password: 'test123', department: 'Finance' },
      { name: 'IT Test User', email: 'it@test.com', password: 'test123', department: 'IT' }
    ];

    for (const user of testUsers) {
      // Test signup
      const signupResult = await this.makeRequest('POST', '/auth/signup', user);
      
      if (signupResult.ok) {
        await this.log(`✅ Signup successful for ${user.department} user`, 'success');
        this.tokens[user.department] = signupResult.data.token;
      } else {
        // Try signin if user already exists
        const signinResult = await this.makeRequest('POST', '/auth/signin', {
          email: user.email,
          password: user.password
        });
        
        if (signinResult.ok) {
          await this.log(`✅ Signin successful for ${user.department} user`, 'success');
          this.tokens[user.department] = signinResult.data.token;
        } else {
          await this.log(`❌ Authentication failed for ${user.department} user`, 'error');
        }
      }
    }

    return Object.keys(this.tokens).length > 0;
  }

  async testIssuesAPI() {
    await this.log('Testing Issues API endpoints...');
    
    if (!this.tokens.Tech || !this.tokens.HR) {
      await this.log('❌ Missing required tokens for issues testing', 'error');
      return false;
    }

    // Test creating an issue (Tech user)
    const issueData = {
      title: 'Test Issue - API Test',
      description: 'This is a test issue created by API testing',
      category: 'Software',
      priority: 'Medium',
      reportedByDepartment: 'Tech'
    };

    const createResult = await this.makeRequest('POST', '/issues', issueData, this.tokens.Tech);
    
    if (createResult.ok) {
      await this.log('✅ Issue creation successful', 'success');
      const issueId = createResult.data._id;

      // Test getting all issues (HR user)
      const getAllResult = await this.makeRequest('GET', '/issues', null, this.tokens.HR);
      
      if (getAllResult.ok) {
        await this.log(`✅ Get all issues successful - Found ${getAllResult.data.length} issues`, 'success');
      } else {
        await this.log('❌ Get all issues failed', 'error');
      }

      // Test updating issue status (HR user)
      const updateResult = await this.makeRequest('PUT', `/issues/${issueId}`, {
        status: 'working'
      }, this.tokens.HR);

      if (updateResult.ok) {
        await this.log('✅ Issue status update successful', 'success');
      } else {
        await this.log('❌ Issue status update failed', 'error');
      }

      return true;
    } else {
      await this.log('❌ Issue creation failed', 'error');
      return false;
    }
  }

  async testRoutingAPI() {
    await this.log('Testing Routing API endpoints...');
    
    if (!this.tokens.HR) {
      await this.log('❌ Missing HR token for routing testing', 'error');
      return false;
    }

    // Test routing suggestions
    const suggestionsResult = await this.makeRequest('GET', '/issues/routing-suggestions', null, this.tokens.HR);
    
    if (suggestionsResult.ok) {
      await this.log(`✅ Routing suggestions successful - Found ${suggestionsResult.data.length} suggestions`, 'success');
    } else {
      await this.log('❌ Routing suggestions failed', 'error');
    }

    // Test auto-routing
    const autoRouteResult = await this.makeRequest('POST', '/issues/auto-route', {}, this.tokens.HR);
    
    if (autoRouteResult.ok) {
      await this.log(`✅ Auto-routing successful - Routed ${autoRouteResult.data.routedCount} issues`, 'success');
    } else {
      await this.log('❌ Auto-routing failed', 'error');
    }

    return true;
  }

  async testExpensesAPI() {
    await this.log('Testing Expenses API endpoints...');
    
    if (!this.tokens.Finance) {
      await this.log('❌ Missing Finance token for expenses testing', 'error');
      return false;
    }

    // Test creating an expense
    const expenseData = {
      description: 'Test Expense - API Test',
      amount: 100.50,
      category: 'Office Supplies',
      date: new Date().toISOString().split('T')[0]
    };

    const createResult = await this.makeRequest('POST', '/expenses', expenseData, this.tokens.Finance);
    
    if (createResult.ok) {
      await this.log('✅ Expense creation successful', 'success');

      // Test getting all expenses
      const getAllResult = await this.makeRequest('GET', '/expenses', null, this.tokens.Finance);
      
      if (getAllResult.ok) {
        await this.log(`✅ Get all expenses successful - Found ${getAllResult.data.length} expenses`, 'success');
      } else {
        await this.log('❌ Get all expenses failed', 'error');
      }

      return true;
    } else {
      await this.log('❌ Expense creation failed', 'error');
      return false;
    }
  }

  async testTeamManagementAPI() {
    await this.log('Testing Team Management API endpoints...');
    
    if (!this.tokens.HR) {
      await this.log('❌ Missing HR token for team management testing', 'error');
      return false;
    }

    // Test getting team
    const teamResult = await this.makeRequest('GET', '/teams/my-team', null, this.tokens.HR);
    
    if (teamResult.ok) {
      await this.log('✅ Get team successful', 'success');
    } else {
      await this.log('❌ Get team failed', 'error');
    }

    // Test getting users by department
    const usersResult = await this.makeRequest('GET', '/users/department/Tech', null, this.tokens.HR);
    
    if (usersResult.ok) {
      await this.log(`✅ Get users by department successful - Found ${usersResult.data.length} Tech users`, 'success');
    } else {
      await this.log('❌ Get users by department failed', 'error');
    }

    return true;
  }

  async testAnalyticsAPI() {
    await this.log('Testing Analytics API endpoints...');
    
    if (!this.tokens.HR) {
      await this.log('❌ Missing HR token for analytics testing', 'error');
      return false;
    }

    const analyticsResult = await this.makeRequest('GET', '/analytics/summary', null, this.tokens.HR);
    
    if (analyticsResult.ok) {
      await this.log('✅ Analytics summary successful', 'success');
      await this.log(`   - Total Users: ${analyticsResult.data.totalUsers}`, 'info');
      await this.log(`   - Total Issues: ${analyticsResult.data.totalIssues}`, 'info');
      await this.log(`   - Total Expenses: ${analyticsResult.data.totalExpenses}`, 'info');
    } else {
      await this.log('❌ Analytics summary failed', 'error');
    }

    return analyticsResult.ok;
  }

  async runAllTests() {
    await this.log('🚀 Starting comprehensive API testing...', 'info');
    
    const tests = [
      { name: 'Health Check', fn: () => this.testHealthCheck() },
      { name: 'Authentication', fn: () => this.testAuthentication() },
      { name: 'Issues API', fn: () => this.testIssuesAPI() },
      { name: 'Routing API', fn: () => this.testRoutingAPI() },
      { name: 'Expenses API', fn: () => this.testExpensesAPI() },
      { name: 'Team Management API', fn: () => this.testTeamManagementAPI() },
      { name: 'Analytics API', fn: () => this.testAnalyticsAPI() }
    ];

    const results = {};
    
    for (const test of tests) {
      await this.log(`\n📋 Running ${test.name} tests...`, 'info');
      try {
        results[test.name] = await test.fn();
      } catch (error) {
        await this.log(`❌ ${test.name} test failed with error: ${error.message}`, 'error');
        results[test.name] = false;
      }
    }

    // Summary
    await this.log('\n📊 TEST SUMMARY', 'info');
    await this.log('=' * 50, 'info');
    
    let passed = 0;
    let total = 0;
    
    for (const [testName, result] of Object.entries(results)) {
      total++;
      if (result) {
        passed++;
        await this.log(`✅ ${testName}: PASSED`, 'success');
      } else {
        await this.log(`❌ ${testName}: FAILED`, 'error');
      }
    }

    await this.log(`\n🎯 Overall Results: ${passed}/${total} tests passed`, passed === total ? 'success' : 'error');
    
    if (passed === total) {
      await this.log('🎉 All API tests passed! Backend-Frontend integration is working correctly.', 'success');
    } else {
      await this.log('⚠️  Some tests failed. Please check the logs above for details.', 'error');
    }

    return { passed, total, results };
  }
}

// Run the tests
async function main() {
  const tester = new APITester();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = APITester;
