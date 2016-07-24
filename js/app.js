

var model = {
  MAX_TABLES: 12,
  INITIAL_TIMER: 30,
  CORRECT_INCREMENT: 2,
  tables: [],
  cntOperations: 0,
  cntCorrect: 0,
  maxOperand: 0,
  level: 0,
  progressValue: 0,
  init: function() {
    model.tables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    model.maxOperand = 12;
    model.level = 1;
    model.progressValue = model.INITIAL_TIMER;
  }
};

var octopus = {
  init: function() {
    model.init();
    viewModel.init();
    // Start timer for updating progress bar
    window.setInterval(function() {
      console.log('progress:', model.progressValue, viewModel.barProgress());
      if (model.progressValue > 0 ) {
        model.progressValue--;
      }
      viewModel.updateBarProgress( Math.round(octopus.getProgressPct()) );
    }, 1000);
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
    if((viewModel.table() * viewModel.operand()) == Number(viewModel.inputResult())) {
      // Correct answer
      model.progressValue += model.CORRECT_INCREMENT;
      //viewModel.soundOk.play();
    } else {
      // Incorrect answer
      //viewModel.soundError.play();
    }
  },
  getProgressPct: function() {
    return model.progressValue * 100.0 / model.INITIAL_TIMER;
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
    octopus.checkResult();
    viewModel.inputResult('');
    // Check result
    viewModel.nextOperation();
  },
  barProgress: ko.observable(0),
  updateBarProgress: function(newPct) {
    viewModel.barProgress( newPct );
    var el = $('.progress-bar');
    if( newPct > 50.0 ) {
      el.addClass('progress-bar-success').removeClass('progress-bar-warning').removeClass('progress-bar-danger');
    } else if( newPct >= 25.0 ) {
      el.addClass('progress-bar-warning').removeClass('progress-bar-success').removeClass('progress-bar-danger');
    } else {
      el.addClass('progress-bar-danger').removeClass('progress-bar-success').removeClass('progress-bar-warning');
    }
  },
  init: function() {
    // Initial setting of Progress bar
    viewModel.barProgress( octopus.getProgressPct() );
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
