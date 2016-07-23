

var model = {
  MAX_TABLES: 12,
  INITIAL_TIMER: 90,
  tables: [],
  cntOperations: 0,
  cntCorrect: 0,
  maxOperand: 0,
  level: 0,
  init: function() {
    model.tables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    model.maxOperand = 12;
    model.level = 1;
  }
};

var octopus = {
  init: function() {
    model.init();
    viewModel.init();
  },
  setTables: function(tables) {
    // Check tables is a list with values between 2-12
  },
  getTable: function() {
    return model.tables[Math.floor( Math.random() * model.tables.length )];
  },
  getOperand: function() {
    return Math.floor( Math.random() * model.maxOperand ) + 1;
  },
  checkResult: function() {
    console.log(Number(viewModel.inputResult),
                (viewModel.table() * viewModel.operand()) == Number(viewModel.inputResult()));
    if((viewModel.table() * viewModel.operand()) == Number(viewModel.inputResult())) {
      console.log('OK');
      viewModel.soundOk.play();
    } else {
      console.log('ERROR');
      viewModel.soundError.play();
    }
  }
};

var viewModel = {
  //tables: [false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  table: ko.observable(0),
  operand: ko.observable(0),
  operation: ko.pureComputed(function(){
    return viewModel.table() + ' x ' + viewModel.operand() + ' = ';
  }, this),
  inputResult: ko.observable(''),
  nextOperation: function() {
    viewModel.table( octopus.getTable() );
    viewModel.operand( octopus.getOperand() );
  },
  submitResult: function() {
    console.log('Input result:', viewModel.inputResult());
    octopus.checkResult();
    viewModel.inputResult('');
    // Check result
    viewModel.nextOperation();
  },
  init: function() {
    viewModel.nextOperation();
  },
  soundOk: new Audio('sound/ok.wav'),
  soundError: new Audio('sound/error.wav')
};

ko.applyBindings(viewModel);
octopus.init();


// var MAX_COUNT = 10000;
// var cntTable = [0,0,0,0,0,0,0,0,0,0,0,0,0];
// var cntOperand = [0,0,0,0,0,0,0,0,0,0,0,0,0];
// var cnt;
// for(cnt = 0; cnt < MAX_COUNT; cnt++) {
//   cntTable[octopus.getTable()]++;
//   cntOperand[octopus.getOperand()]++;
// }
// for(cnt = 0; cnt < cntTable.length; cnt++) {
//   cntTable[cnt] /= MAX_COUNT;
// }
// for(cnt = 0; cnt < cntOperand.length; cnt++) {
//   cntOperand[cnt] /= MAX_COUNT;
// }
// console.log(cntTable, cntOperand);
