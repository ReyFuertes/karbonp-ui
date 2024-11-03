
export interface IGettingStartedMock {
  name: string,
  cssClass?: string,
  header?: {
    text?: string,
    icon?: string,
    imageUrl?: string,
    priceText?: string,
  },
  content?: {
    bannerText?: string,
    callToActions?: {
      imageUrl?: string,
      title?: string,
      description?: string,
    }[]
  },
  slogan?: {
    text?: string,
  }
}