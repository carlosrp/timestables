

var model = {
  MAX_TABLES: 12,
  INITIAL_TIMER: 30,
  CORRECT_INCREMENT: 2,
  tables: [],
  operands: [],
  cntOperations: 0,
  cntCorrect: 0,
  maxOperand: 0,
  level: 0,
  progressValue: 0,
  init: function() {
    //model.tables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    //model.maxOperand = 12;
    model.level = 1;
    model.progressValue = model.INITIAL_TIMER;
  }
};

var octopus = {
  interval: [],
  init: function() {
    model.init();
    viewModel.init();
  },
  initPractice: function(tables, operands) {
    // Update model tables and operands with initial selections
    model.tables = tables;
    model.operands = operands;
    // Start timer for updating progress bar
    octopus.interval = setInterval(function() {
      console.log('progress:', model.progressValue, viewModel.barProgress());
      if (model.progressValue > 0 ) {
        model.progressValue--;
        viewModel.updateBarProgress( Math.round(octopus.getProgressPct()) );
      } else {
        octopus.finishPractice();
      }
    }, 1000);
  },
  finishPractice: function() {
    clearInterval(octopus.interval);
    viewModel.finishPractice();
  },
  setTables: function(tables) {
    // Check tables is a list with values between 2-12
  },
  getTable: function() {
    return model.tables[Math.floor( Math.random() * model.tables.length )];
  },
  getOperand: function() {
    return model.operands[Math.floor( Math.random() * model.operands.length )];
    //return Math.floor( Math.random() * model.maxOperand ) + 1;
  },
  checkResult: function() {
    if((viewModel.table() * viewModel.operand()) == Number(viewModel.inputResult())) {
      // Correct answer
      model.progressValue += model.CORRECT_INCREMENT;
      viewModel.soundOk.play();
      viewModel.correctAnswers(++model.cntCorrect);
    } else {
      // Incorrect answer
      viewModel.soundError.play();
    }
    viewModel.cntOperations(++model.cntOperations);
  },
  getProgressPct: function() {
    return model.progressValue * 100.0 / model.INITIAL_TIMER;
  }
};

var viewModel = {
  // List of available Tables and Operands to be selected in initial form
  availableTables: ko.observable([2,3,4,5,6,7,8,9,10,11,12]),
  availableOperands: ko.observable([2,3,4,5,6,7,8,9,10,11,12]),
  table: ko.observable(0),
  //allTables: ko.observable(true),
  selectedTables: ko.observableArray([2,3,4,5,6,7,8,9,10,11,12]),
  selectedOperands: ko.observableArray([2,3,4,5,6,7,8,9,10,11,12]),
  operand: ko.observable(0),
  //allOperands: ko.observable(true),
  //selOperands: ko.observableArray(),
  operation: ko.pureComputed(function(){
    return viewModel.table() + ' x ' + viewModel.operand() + ' = ';
  }, this),
  inputResult: ko.observable(''),
  correctAnswers: ko.observable(0),
  cntOperations: ko.observable(0),
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
  submitInitialConfig: function() {
    console.log('Initial form submitted:', viewModel.selectedTables(), viewModel.selectedOperands());
    // Hide Practice Settings
    $('.intro-settings').hide();
    // Unhide main view
    $('.main-view').show();
    // Start Practice
    octopus.initPractice(viewModel.selectedTables(), viewModel.selectedOperands());
  },
  finishPractice: function() {
    $('.main-view').hide();
    $('.results-view').show();
  },
  // selections: function() {
  //   console.log('All Tables:', viewModel.allTables(), "All Operands:", viewModel.allOperands());
  // },
  init: function() {
    // Initial settings for options selection
    $('#table-selection').multiselect({
      includeSelectAllOption: true,
      allSelectedText: 'All Tables'
    });
    $('#Operand-selection').multiselect({
      includeSelectAllOption: true,
      allSelectedText: 'All Operands'
    });
    // Initial setting of Progress bar
    viewModel.barProgress( octopus.getProgressPct() );
    viewModel.nextOperation();

  },
  startOver: function() {
    octopus.init();
    $('.intro-settings').show();
    $('.main-view').hide();
    $('.results-view').hide();
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
