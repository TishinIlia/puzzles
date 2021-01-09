class Puzzles {
  constructor(pieces) {
    this.rowLength = 10
    this.pieces = pieces.map(item => new PuzzlePiece(item))
    this.currentPiece = this.pieces[0]
    this.sorted = [this.currentPiece]
    this.threads = []
    this.finish = false
    this.result = []
    // this.possibleLengths = this.findAllDivisors(this.pieces.length)
  }

  initNewThread(pieces, sorted, currentPiece) {
    this.threads.push(
      new PuzzleThreadSolution(
        pieces,
        sorted,
        currentPiece,
        this.threads.length
      )
    )
  }

  initFirstPiece() {
    this.pieces.splice(0, 1)
    this.currentPiece.findRotation(
      ['left', 'top'],
      [null, null]
    )
  }

  removeThread(index) {
    this.threads.splice(index, 1)
  }

  run() {
    this.initFirstPiece()
    this.initNewThread(
      [...this.pieces],
      [...this.sorted],
      Object.create(this.currentPiece)
    )
    while (this.threads.length > 0) {
      for (let thread of this.threads) {
        this.nextPiece(thread)
        if (this.finish) {
          return
        }
      }
    }
  }

  nextPiece(thread) {
    if (thread.sorted.length === 100 && thread.pieces.length === 0 && thread.sorted[thread.sorted.length - 1].isLast) {
      this.finish = true
      this.result = thread.sorted
      return
    }
    if (thread.currentPiece.edges['right'] !== null) {
      // this.rowLength += 1
      this.findRightPiece(thread)
    } else {
      this.findDownPiece(thread)
    }
  }

  findRightPiece(thread) {
    const directions = ['left', 'top']
    const values = [thread.currentPiece.edges['right']['edgeTypeId'], this.isFirstRow(thread)]
    this.findMatchedPieces(thread, directions, values)
  }

  findDownPiece(thread) {
    thread.currentPiece = thread.sorted[thread.sorted.length - this.rowLength]
    if (thread.currentPiece != null) {
      const directions = ['top', 'left']
      const values = [thread.currentPiece.edges['bottom']['edgeTypeId'], null]
      this.findMatchedPieces(thread, directions, values)
    } else {
      const directions = ['top', 'left']
      const values = [null, null]
      this.findMatchedPieces(thread, directions, values)
    }
  }

  findMatchedPieces(thread, directions, values) {
    const solutions = []
    for (let index = 0; index < thread.pieces.length; index++) {
      const piece = thread.pieces[index]
      if (piece.findRotation(directions, values)) {
        solutions.push({
          'piece': piece,
          'index': index
        })
      }
    }
    if (solutions.length === 0) {
      this.removeThread(thread.threadId)
    } else if (solutions.length === 1) {
      thread.sorted.push(solutions[0]['piece'])
      thread.currentPiece = solutions[0]['piece']
      thread.pieces.splice(solutions[0]['index'], 1)
    } else if (solutions.length > 1) {
      this.removeThread(thread.threadId)
      for (let solution of solutions) {
        const newPieces = [...thread.pieces]
        const newSorted = [...thread.sorted]
        const newCurrentPiece = solution['piece']
        newSorted.push(solution['piece'])
        newPieces.splice(solution['index'], 1)
        this.initNewThread(
          newPieces,
          newSorted,
          newCurrentPiece
        )
      }
    } else {
      this.removeThread(thread.threadId)
    }
  }

  isFirstRow(thread) {
    if (thread.sorted.length > this.rowLength && thread.sorted[thread.sorted.length - this.rowLength]['edges']['bottom'] !== null) {
      return thread.sorted[thread.sorted.length - this.rowLength]['edges']['bottom']['edgeTypeId']
    }
    return null
  }

  get solvedPuzzle() {
    this.run()
    return this.result.map(elem => elem.piece.id)
  }

  findAllDivisors(number) {
    const result = []
    let i = 1
    while (i <= Math.sqrt(number)) {
      if (number % i === 0) {
        if (number / i === i) {
          result.push(i)
        } else {
          result.push(i)
          result.push(number / i)
        }
      }
      i = i + 1
    }
    return result
  }
}

class PuzzleThreadSolution {
  constructor(pieces, sorted, currentPiece, id) {
    this.pieces = pieces
    this.sorted = sorted
    this.currentPiece = currentPiece
    this.threadId = id
  }
}

class PuzzlePiece {
  constructor(piece) {
    this.id = piece.id
    this.edges = piece.edges
  }

  findRotation(neededDirections, values) {
    let turns = 0
    while (this.isNeedRotate(neededDirections, values) && turns < 4) {
      this.rotation()
      turns += 1
    }
    return turns < 4
  }

  isNeedRotate(neededDirections, values) {
    for (let i = 0; i < neededDirections.length; i++) {
      const directionValue = this.edges[neededDirections[i]]
      if (values[i] === null && directionValue !== values[i]) {
        return true
      } else if (values[i] !== null && (directionValue === null || directionValue['edgeTypeId'] !== values[i])) {
        return true
      }
    }
    return false
  }

  rotation() {
    const temp = this.edges['left']
    this.edges['left'] = this.edges['top']
    this.edges['top'] = this.edges['right']
    this.edges['right'] = this.edges['bottom']
    this.edges['bottom'] = temp
  }

  get isLast() {
    return this.edges['right'] === null && this.edges['bottom'] === null
  }

  get piece() {
    return {
      'id': this.id,
      'edges': this.edges
    }
  }
}

function solvePuzzle(pieces) {
  const puzzles = new Puzzles(pieces)
  return puzzles.solvedPuzzle
}

// Не удаляйте эту строку
window.solvePuzzle = solvePuzzle;

