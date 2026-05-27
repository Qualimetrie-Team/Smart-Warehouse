const { calculateStockAlert } = require('../src/stockAlert');

// Règle 1 : stock sous le seuil → "À COMMANDER"
describe('Statut À COMMANDER', () => {

  test('stock sous le seuil → statut À COMMANDER', () => {
    const result = calculateStockAlert({
      stock: 5,
      seuil: 20,
      produit: { nom: 'Vis', type: 'Normal' },
      fournisseur: 'Etranger',
      periode: 'Normal'
    });
    expect(result.status).toBe('À COMMANDER');
  });

  test('stock au dessus du seuil → statut OK', () => {
    const result = calculateStockAlert({
      stock: 50,
      seuil: 20,
      produit: { nom: 'Vis', type: 'Normal' },
      fournisseur: 'Etranger',
      periode: 'Normal'
    });
    expect(result.status).toBe('OK');
  });

});

//  Règle 2 : stock à 0 → "CRITIQUE"
describe('Statut CRITIQUE', () => {

  test('stock exactement à 0 → statut CRITIQUE', () => {
    const result = calculateStockAlert({
      stock: 0,
      seuil: 20,
      produit: { nom: 'Vis', type: 'Normal' },
      fournisseur: 'Etranger',
      periode: 'Normal'
    });
    expect(result.status).toBe('CRITIQUE');
  });

});

// Règle 3 : produit Périssable → seuil doublé
describe('Produit Perissable', () => {

  test('produit perissable double le seuil', () => {
    const result = calculateStockAlert({
      stock: 25,
      seuil: 20,
      produit: { nom: 'Lait', type: 'Périssable' },
      fournisseur: 'Etranger',
      periode: 'Normal'
    });
    // seuil doublé = 40, stock 25 < 40 → À COMMANDER
    expect(result.seuil).toBe(40);
    expect(result.status).toBe('À COMMANDER');
  });

  test('produit perissable stock OK après doublement du seuil', () => {
    const result = calculateStockAlert({
      stock: 50,
      seuil: 20,
      produit: { nom: 'Lait', type: 'Périssable' },
      fournisseur: 'Etranger',
      periode: 'Normal'
    });
    // seuil doublé = 40, stock 50 > 40 → OK
    expect(result.status).toBe('OK');
  });

});

// Règle 4 : fournisseur Local → délai 2 jours 
describe('Délai fournisseur', () => {

  test('fournisseur Local → délai 2 jours', () => {
    const result = calculateStockAlert({
      stock: 0,
      seuil: 20,
      produit: { nom: 'Vis', type: 'Normal' },
      fournisseur: 'Local',
      periode: 'Normal'
    });
    expect(result.delaiEstime).toBe(2);
  });

  test('fournisseur Etranger → délai 15 jours', () => {
    const result = calculateStockAlert({
      stock: 0,
      seuil: 20,
      produit: { nom: 'Vis', type: 'Normal' },
      fournisseur: 'Etranger',
      periode: 'Normal'
    });
    expect(result.delaiEstime).toBe(15);
  });

});

// Règle 5 : période Noël → quantité +30%
describe('Période Noël', () => {

  test('periode Noël augmente la quantite de 30%', () => {
    const result = calculateStockAlert({
      stock: 5,
      seuil: 20,
      produit: { nom: 'Jouet', type: 'Normal' },
      fournisseur: 'Etranger',
      periode: 'Noël'
    });
    // quantité de base = 20 - 5 = 15, +30% = 19.5 → arrondi à 20
    expect(result.quantiteCommande).toBe(20);
  });

  test('periode normale → pas de majoration', () => {
    const result = calculateStockAlert({
      stock: 5,
      seuil: 20,
      produit: { nom: 'Jouet', type: 'Normal' },
      fournisseur: 'Etranger',
      periode: 'Normal'
    });
    // quantité = 20 - 5 = 15
    expect(result.quantiteCommande).toBe(15);
  });

});

// Combinaisons critiques
describe('Combinaisons de règles', () => {

  test('perissable + stock 0 + Noël + Local', () => {
    const result = calculateStockAlert({
      stock: 0,
      seuil: 20,
      produit: { nom: 'Dinde', type: 'Périssable' },
      fournisseur: 'Local',
      periode: 'Noël'
    });
    expect(result.status).toBe('CRITIQUE');
    expect(result.seuil).toBe(40);
    expect(result.delaiEstime).toBe(2);
    // quantité = 40*2 = 80, +30% = 104
    expect(result.quantiteCommande).toBe(104);
  });

});