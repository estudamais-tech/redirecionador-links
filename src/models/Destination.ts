export interface DestinationModel {
  name: string; //nome da plataforma que está sendo linkada
  url: string; //url do link
  description?: string; //descrição opcional do link
  isActive: boolean; //caso haja desativação do link
}
