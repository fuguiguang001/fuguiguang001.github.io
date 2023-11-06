
document.addEventListener('DOMContentLoaded', function () {

  var cy = window.cy = cytoscape({
    container: document.getElementById('cy'),

    style: [
      {
        selector: 'node',
        style: {
          'content': 'data(id)'
        }
      },

      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle'
        }
      }
    ],

    elements: {
      nodes: [
        { data: { id: 'a' } },
        { data: { id: 'b' } }
      ],
      edges: [
        { data: { id: 'ab', source: 'a', target: 'b' } }
      ]
    },

    layout: {
      name: 'grid'
    }
  });

  var a = cy.getElementById('a');
  var b = cy.getElementById('b');
  var ab = cy.getElementById('ab');

  var makeDiv = function(text){
    var div = document.createElement('div');

    div.classList.add('popper-div');

    div.innerHTML = text;

    document.body.appendChild( div );

    return div;
  };

  var popperA = a.popper({
    content: function(){ return makeDiv('Sticky position div'); }
  });

  var updateA = function(){
    popperA.update();
  };

  a.on('position', updateA);
  cy.on('pan zoom resize', updateA);

  var popperB = b.popper({
    content: function(){ return makeDiv('One time position div'); }
  });

  var popperAB = ab.popper({
    content: function(){ return makeDiv('Sticky position div'); }
  });

  var updateAB = function(){
    popperAB.update();
  };

  ab.connectedNodes().on('position', updateAB);
  cy.on('pan zoom resize', updateAB);
});
