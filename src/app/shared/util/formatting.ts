import { IEmployee } from "src/app/modules/employee/employee.model";

export const isNumber = (value: any) => {
  if (!(typeof value === 'number')) {
    return value;
  }
  return Number(value);
}

export const processDownloadedFile = (result: Blob, downloadedReport: any, name: string = ''): void => {
  try {
    if (result) {
      const fileName = `${name}.xlsx`;
      const navigator = (window.navigator as any);
      if (navigator?.msSaveOrOpenBlob)
        navigator.msSaveOrOpenBlob(new Blob([downloadedReport], { type: 'text/excel' }), fileName); // for IE
      else {
        const doc = document.createElement('a');
        doc.href = window.URL.createObjectURL(result);
        doc.download = fileName
        document.body.appendChild(doc);
        doc.click();
        document.body.removeChild(doc);
      }
    }
  } catch (error) {
    console.log(`processDownloadedFile ${error}`);
  }
}

export const employeeToForm = (employee: IEmployee) => {
  return {
    basics: {
      id: employee?.id || 0,
      fullName: employee.fullName,
      payFrequency: employee?.payFrequency,
      number: employee?.number || Number(`0000${employee?.id}`),//note: employee id prefix temporary for testing
      firstName: employee?.firstName,
      middleName: employee?.middleName,
      lastName: employee?.lastName,
      dateOfBirth: new Date(employee.dateOfBirth),
      dateOfAppointment: new Date(employee.dateOfAppointment),
      identificationType: employee?.identificationType,
      mobileNumber: employee?.mobileNumber,
      landLine: employee?.landLine,
      email: employee?.email,
      paymentMethod: employee?.paymentMethod,
      jobTitle: employee?.jobTitle,
      payPointId: employee?.payPointId,
      organizationalUnit: employee?.organizationalUnit,
      alternativeIdentificationNumber: employee?.alternativeIdentificationNumber,
      philippineHealthNo: employee?.philippineHealthNo,
      hdmfNo: employee?.hdmfNo,
      incomeTaxNumber: employee?.incomeTaxNumber,
      active: employee?.active,
      selfServiceEnabled: employee?.selfServiceEnabled,
    },
    bankDetails: {
      bankId: employee?.bankId,
      bankAccountNumber: employee?.bankAccountNumber,
      bankRoutingNumber: employee?.bankRoutingNumber,
      bankAccountHolder: employee?.bankAccountHolder,
      bankBranchCode: employee?.bankBranchCode,
    },
    residentialAddress: employee?.residentialAddress,
    postalAddress: employee?.postalAddress,
    biography: {
      biographyDo: employee?.biographyDo,
      biographyAbout: employee?.biographyAbout
    },
    emergencyContacts: employee?.emergencyContacts
  }
}

export const toCssClass = (name: string): string => {
  return name?.toLowerCase()?.replace(/ +/g, "-");
}

export const formatToJson = (str: string): any => {
  return str ? JSON.parse(str) : {};
}

export const getInitials = (value: string) => {
  const intials = value.split(' ');
  return `${intials[0] ? intials[0][0] : ''}${intials[1] ? intials[1][0] : ''}`;
}

export const emailRegex = {
  email: '[a-zA-Z0-9.-_-!#$%&\'*+-/=?^_`{|}~]{1,}@[a-zA-Z.-]{2,}[.]{1}([a-zA-Z]{2,3}|(aero|coop|info|museum|name))'
};