import { IGettingStartedMock } from "src/app/models/mock.model";

export const TimeOffMock: IGettingStartedMock = {
  name: 'Time off',
  cssClass: 'orange',
  header: {
    text: 'A central place to store and share Time off and information',
    icon: 'domain',
    imageUrl: 'get-started-time-off-sample-header-image.png',
    priceText: 'Free'
  },
  content: {
    bannerText: `The Time off app helps keep important Time Off and information organised and accessible for the whole team (or specific people, the permissions are completely configurable). Share your employee handbook with new hires or make a note of your Registered Address and VAT number.`,
    callToActions: [{  
      imageUrl: 'getting-started-images/company-files-sample-image.png',
      title: 'Time Off files',
      description: 'Securely store and share Time Off like handbooks, policies, templates, and forms.'
    }, {
      imageUrl: 'getting-started-images/everything-in-one-place-sample-image.png',
      title: 'Everything in one place',
      description: 'Never search for Time Off again – everything from registered addresses and VAT number to Wifi passwords and door codes.'
    }, {
      imageUrl: 'getting-started-images/free-hr-resources-sample-image.png',
      title: 'Free HR resources',
      description: 'How-to guides and templates based on best-practice covering a range of topics such as employment policies, interview questions, and employment contracts.'
    }]
  },
  slogan: {
    text: 'A central place to store and share company documents and information'
  }
}

export const CompanyProfileMock: IGettingStartedMock = {
  name: 'Company Profile',
  cssClass: 'red',
  header: {
    text: 'A central place to storeand share company files and information',
    icon: 'domain',
    imageUrl: 'get-started-company-profile-sample-header-image.png',
    priceText: 'Free'
  },
  content: {
    bannerText: `The company profile app helps keep important company files and information organised and accessible for the whole team (or specific people, the permissions are completely configurable). Share your employee handbook with new hires or make a note of your Registered Address and VAT number.`,
    callToActions: [{
      imageUrl: 'getting-started-images/company-files-sample-image.png',
      title: 'Company files',
      description: 'Securely store and share company files like handbooks, policies, templates, and forms.'
    }, {
      imageUrl: 'getting-started-images/everything-in-one-place-sample-image.png',
      title: 'Everything in one place',
      description: 'Never search for company info again – everything from registered addresses and VAT number to Wifi passwords and door codes.'
    }, {
      imageUrl: 'getting-started-images/free-hr-resources-sample-image.png',
      title: 'Free HR resources',
      description: 'How-to guides and templates based on best-practice covering a range of topics such as employment policies, interview questions, and employment contracts.'
    }]
  },
  slogan: {
    text: 'A central place to store and share company documents and information'
  }
}

export const ReportsMock: IGettingStartedMock = {
  name: 'Reports',
  cssClass: 'blue',
  header: {
    text: 'Easily visualize HR data and gain valuable insights into your business.',
    icon: 'monitoring',
    imageUrl: 'get-started-reports-sample-header-image.png',
    priceText: 'Included in Advanced plan'
  },
  content: {
    bannerText: `Reports provide access to well-organized, relevant business data that helps you identify trends, see which processes are working well, and learn where things need to improve. Air’s HR Reports makes it easy visualize key HR data and gain valuable insights into your business.`,
    callToActions: [{
      imageUrl: 'getting-started-images/Instant insights-sample-image.png',
      title: 'Simple reporting & submitting',
      description: 'Employees can easily submit expenses and Air will create a report and auto-submit it for approval.'
    }, {
      imageUrl: 'getting-started-images/manage-automatically-sample-image.png',
      title: 'Managed automatically',
      description: 'Manage all expenses in the cloud. Expenses appear on people’s profiles.'
    }, {
      imageUrl: 'getting-started-images/integrate-with-payroll-sample-image.png',
      title: 'Integrate with Payroll',
      description: 'Expenses can be pulled through to Payroll automatically and employees can be reimbursed on their next paycheck.'
    }]
  },
  slogan: {
    text: 'Make it quick and easy to report and manage expenses'
  }
}

export const ExpensesMock: IGettingStartedMock = {
  name: 'Expenses',
  cssClass: 'blue',
  header: {
    text: 'Make it quick and easy to report and manage expenses',
    icon: 'account_balance_wallet',
    imageUrl: 'get-started-expenses-sample-header-image.png',
    priceText: '£1 per person, per month'
  },
  content: {
    bannerText: 'Save time and effort on expense reporting with the Air expenses app. Easily automate your company’s expense reporting.',
    callToActions: [{
      imageUrl: 'getting-started-images/reporting-submitting-sample-image.png',
      title: 'Simple reporting & submitting',
      description: 'Air provides a variety of preconfigured reports and charts that let you analyze data from across all your Air apps.'
    }, {
      imageUrl: 'getting-started-images/always-up-to-date-sample-image.png',
      title: 'Managed automatically',
      description: 'Any changes made to company or employee data are automatically reflected in your reports so you always have instant access to the latest information.'
    }, {
      imageUrl: 'getting-started-images/insights-and-analysis-sample-image.png',
      title: 'Integrate with Payroll',
      description: 'Study a wide range of metrics. Reports also help you stay on top employee records, keeping everything complete, up-to-date, and organised.'
    }]
  },
  slogan: {
    text: 'Easily visualize HR data and gain valuable insights into your business.'
  }
}