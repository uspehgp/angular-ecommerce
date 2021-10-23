export class Product {
  id: string;
  sku: string;
  name: string = '';
  description: string = '';
  unitPrice: number;
  imageUrl: string;
  active: boolean;
  unitsInStock: number = 0;
  dateCreated: Date;
  lastUpdate: Date;
}
