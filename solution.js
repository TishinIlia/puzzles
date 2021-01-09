"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Puzzles = /*#__PURE__*/function () {
  function Puzzles(pieces) {
    _classCallCheck(this, Puzzles);

    this.rowLength = 10;
    this.pieces = pieces.map(function (item) {
      return new PuzzlePiece(item);
    });
    this.currentPiece = this.pieces[0];
    this.sorted = [this.currentPiece];
    this.threads = [];
    this.finish = false;
    this.result = []; // this.possibleLengths = this.findAllDivisors(this.pieces.length)
  }

  _createClass(Puzzles, [{
    key: "initNewThread",
    value: function initNewThread(pieces, sorted, currentPiece) {
      this.threads.push(new PuzzleThreadSolution(pieces, sorted, currentPiece, this.threads.length));
    }
  }, {
    key: "initFirstPiece",
    value: function initFirstPiece() {
      this.pieces.splice(0, 1);
      this.currentPiece.findRotation(['left', 'top'], [null, null]);
    }
  }, {
    key: "removeThread",
    value: function removeThread(index) {
      this.threads.splice(index, 1);
    }
  }, {
    key: "run",
    value: function run() {
      this.initFirstPiece();
      this.initNewThread(_toConsumableArray(this.pieces), _toConsumableArray(this.sorted), Object.create(this.currentPiece));

      while (this.threads.length > 0) {
        var _iterator = _createForOfIteratorHelper(this.threads),
          _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var thread = _step.value;
            this.nextPiece(thread);

            if (this.finish) {
              return;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }, {
    key: "nextPiece",
    value: function nextPiece(thread) {
      if (thread.sorted.length === 100 && thread.pieces.length === 0 && thread.sorted[thread.sorted.length - 1].isLast) {
        this.finish = true;
        this.result = thread.sorted;
        return;
      }

      if (thread.currentPiece.edges['right'] !== null) {
        // this.rowLength += 1
        this.findRightPiece(thread);
      } else {
        this.findDownPiece(thread);
      }
    }
  }, {
    key: "findRightPiece",
    value: function findRightPiece(thread) {
      var directions = ['left', 'top'];
      var values = [thread.currentPiece.edges['right']['edgeTypeId'], this.isFirstRow(thread)];
      this.findMatchedPieces(thread, directions, values);
    }
  }, {
    key: "findDownPiece",
    value: function findDownPiece(thread) {
      thread.currentPiece = thread.sorted[thread.sorted.length - this.rowLength];

      if (thread.currentPiece != null) {
        var directions = ['top', 'left'];
        var values = [thread.currentPiece.edges['bottom']['edgeTypeId'], null];
        this.findMatchedPieces(thread, directions, values);
      } else {
        var _directions = ['top', 'left'];
        var _values = [null, null];
        this.findMatchedPieces(thread, _directions, _values);
      }
    }
  }, {
    key: "findMatchedPieces",
    value: function findMatchedPieces(thread, directions, values) {
      var solutions = [];

      for (var index = 0; index < thread.pieces.length; index++) {
        var piece = thread.pieces[index];

        if (piece.findRotation(directions, values)) {
          solutions.push({
            'piece': piece,
            'index': index
          });
        }
      }

      if (solutions.length === 0) {
        this.removeThread(thread.threadId);
      } else if (solutions.length === 1) {
        thread.sorted.push(solutions[0]['piece']);
        thread.currentPiece = solutions[0]['piece'];
        thread.pieces.splice(solutions[0]['index'], 1);
      } else if (solutions.length > 1) {
        this.removeThread(thread.threadId);

        var _iterator2 = _createForOfIteratorHelper(solutions),
          _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var solution = _step2.value;

            var newPieces = _toConsumableArray(thread.pieces);

            var newSorted = _toConsumableArray(thread.sorted);

            var newCurrentPiece = solution['piece'];
            newSorted.push(solution['piece']);
            newPieces.splice(solution['index'], 1);
            this.initNewThread(newPieces, newSorted, newCurrentPiece);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      } else {
        this.removeThread(thread.threadId);
      }
    }
  }, {
    key: "isFirstRow",
    value: function isFirstRow(thread) {
      if (thread.sorted.length > this.rowLength && thread.sorted[thread.sorted.length - this.rowLength]['edges']['bottom'] !== null) {
        return thread.sorted[thread.sorted.length - this.rowLength]['edges']['bottom']['edgeTypeId'];
      }

      return null;
    }
  }, {
    key: "findAllDivisors",
    value: function findAllDivisors(number) {
      var result = [];
      var i = 1;

      while (i <= Math.sqrt(number)) {
        if (number % i === 0) {
          if (number / i === i) {
            result.push(i);
          } else {
            result.push(i);
            result.push(number / i);
          }
        }

        i = i + 1;
      }

      return result;
    }
  }, {
    key: "solvedPuzzle",
    get: function get() {
      this.run();
      return this.result.map(function (elem) {
        return elem.piece.id;
      });
    }
  }]);

  return Puzzles;
}();

var PuzzleThreadSolution = function PuzzleThreadSolution(pieces, sorted, currentPiece, id) {
  _classCallCheck(this, PuzzleThreadSolution);

  this.pieces = pieces;
  this.sorted = sorted;
  this.currentPiece = currentPiece;
  this.threadId = id;
};

var PuzzlePiece = /*#__PURE__*/function () {
  function PuzzlePiece(piece) {
    _classCallCheck(this, PuzzlePiece);

    this.id = piece.id;
    this.edges = piece.edges;
  }

  _createClass(PuzzlePiece, [{
    key: "findRotation",
    value: function findRotation(neededDirections, values) {
      var turns = 0;

      while (this.isNeedRotate(neededDirections, values) && turns < 4) {
        this.rotation();
        turns += 1;
      }

      return turns < 4;
    }
  }, {
    key: "isNeedRotate",
    value: function isNeedRotate(neededDirections, values) {
      for (var i = 0; i < neededDirections.length; i++) {
        var directionValue = this.edges[neededDirections[i]];

        if (values[i] === null && directionValue !== values[i]) {
          return true;
        } else if (values[i] !== null && (directionValue === null || directionValue['edgeTypeId'] !== values[i])) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "rotation",
    value: function rotation() {
      var temp = this.edges['left'];
      this.edges['left'] = this.edges['top'];
      this.edges['top'] = this.edges['right'];
      this.edges['right'] = this.edges['bottom'];
      this.edges['bottom'] = temp;
    }
  }, {
    key: "isLast",
    get: function get() {
      return this.edges['right'] === null && this.edges['bottom'] === null;
    }
  }, {
    key: "piece",
    get: function get() {
      return {
        'id': this.id,
        'edges': this.edges
      };
    }
  }]);

  return PuzzlePiece;
}();

function solvePuzzle(pieces) {
  var puzzles = new Puzzles(pieces);
  return puzzles.solvedPuzzle;
} // Не удаляйте эту строку


window.solvePuzzle = solvePuzzle;
