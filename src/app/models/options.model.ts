
export interface ISearchOptions {
  imageUrl?: string;
  value: string;
}

export interface ICompanyOptions {
  id?: number;
  label: string;
  value: string;
  icon?: string;
  items: {
    companyId: number;
    companyName: string;
    dropDownItemText: string;
    dropDownSelectionText: string;
    locationHasPassword: boolean;
    locationId: number;
    locationName: string;
  }[];
}