
/**
 * Application model
 */
var model = {
  MAX_TABLES: 12,
  INITIAL_TIMER: 30,
  CORRECT_INCREMENT: 2,
  lapseDecrement: 1,
  totalDuration: 0,
  tables: [],
  operands: [],
  cntOperations: 0,
  cntCorrect: 0,
  maxOperand: 0,
  level: 0,
  progressValue: 0,
  /**
   * Model initiaisation
   */
  init: function() {
    //model.tables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    //model.maxOperand = 12;
    model.level = 1;
    model.progressValue = model.INITIAL_TIMER;
    model.lapseDecrement = 1;
    model.totalDuration = 0;
    model.cntOperations = 0;
    model.cntCorrect = 0;
  }
};

/**
 * Application octopus (controller)
 */
var octopus = {
  // timer interval
  interval: [],
  /**
   * Octopus initialisation
   */
  init: function() {
    model.init();
    viewModel.init();
  },
  /**
   * Initialise practice
   */
  initPractice: function(tables, operands) {
    // Update model tables and operands with initial selections
    model.tables = tables;
    model.operands = operands;
    // Get first operation
    viewModel.nextOperation();
    // Start timer for updating progress bar
    octopus.interval = setInterval(function() {
      // Update total duration
      model.totalDuration++;
      // Check current progress
      if (model.progressValue > 0 ) {
        // If still positive, update progress
        model.progressValue -= model.lapseDecrement;
        viewModel.updateBarProgress( Math.round(octopus.getProgressPct()) );
        // Increase Lapse Decrement, every 30 secs
        if (model.totalDuration >= 90) {
          model.lapseDecrement = 3;
        } else if (model.totalDuration >= 60) {
          model.lapseDecrement = 2;
        }
      } else {
        octopus.finishPractice();
      }
      console.log('Total:', model.totalDuration, 'Decrementing:', model.lapseDecrement);
    }, 1000);
  },
  /**
   * Finish practice: stop timer and show results view
   */
  finishPractice: function() {
    clearInterval(octopus.interval);
    viewModel.finishPractice();
  },
  /**
   * Get randomly next table, out of selected tables list
   */
  getTable: function() {
    return model.tables[Math.floor( Math.random() * model.tables.length )];
  },
  /**
   * Get randomly next operand, out of selected operands list
   */
  getOperand: function() {
    return model.operands[Math.floor( Math.random() * model.operands.length )];
    //return Math.floor( Math.random() * model.maxOperand ) + 1;
  },
  /**
   * Check input result and update counters and progress bar
   */
  checkResult: function() {
    // Check if input result is correct
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
  /**
   * Return progress percentage
   */
  getProgressPct: function() {
    return model.progressValue * 100.0 / model.INITIAL_TIMER;
  }
};

/**
 * Application ViewModel
 */
var viewModel = {
  // List of available Tables to be selected in initial form
  availableTables: ko.observable([2,3,4,5,6,7,8,9,10,11,12]),
  // List of available  Operands to be selected in initial form
  availableOperands: ko.observable([2,3,4,5,6,7,8,9,10,11,12]),
  // List of selected Tables and Operands to practice
  selectedTables: ko.observableArray([2,3,4,5,6,7,8,9,10,11,12]),
  selectedOperands: ko.observableArray([2,3,4,5,6,7,8,9,10,11,12]),
  // table in opeation displayed (table x operand)
  table: ko.observable(0),
  // operand in opeation displayed (table x operand)
  operand: ko.observable(0),
  /**
   * KO computed with operation (table x operand)
   */
  operation: ko.pureComputed(function(){
    return viewModel.table() + ' x ' + viewModel.operand() + ' = ';
  }, this),
  // Manual input of result
  inputResult: ko.observable(''),
  // Number of correct operations
  correctAnswers: ko.observable(0),
  // Total of operations
  cntOperations: ko.observable(0),
  /**
   * Get next operation
   */
  nextOperation: function() {
    viewModel.table( octopus.getTable() );
    viewModel.operand( octopus.getOperand() );
  },
  /**
   * Called when submitting a result
   */
  submitResult: function() {
    octopus.checkResult();
    viewModel.inputResult('');
    // Check result
    viewModel.nextOperation();
  },
  // Progress bar value
  barProgress: ko.observable(0),
  /**
   * Update progress bar, based on new percentage provided.
   * It changes colour below 25 and 25 % progress.
   */
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
  /**
   * Called after input configuration form, and sets selected Tables and Operands
   */
  submitInitialConfig: function() {
    // Hide Practice Settings
    $('.intro-settings').hide();
    // Unhide main view
    $('.main-view').show();
    // Start Practice
    octopus.initPractice(viewModel.selectedTables(), viewModel.selectedOperands());
  },
  /**
   * Called once the practice is finished, to show results view
   */
  finishPractice: function() {
    $('.main-view').hide();
    $('.results-view').show();
  },
  /**
   * Called after input configuration form, and sets selected Tables and Operands
   */
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
  },
  /**
   * Called to restart practice
   */
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
