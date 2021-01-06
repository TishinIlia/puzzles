function solvePuzzle(pieces) {
  let startPiece = initPiece(pieces[0])

  const sorted = [...pieces.splice(0,1)]
  let lastRow = false
  let length = 0

  while (true) {
    let counter = 1
    while (true) {
      const topPieceValue = sorted.length > counter ? sorted[sorted.length - length]['edges']['bottom']['edgeTypeId'] : null
      const [elem, index, last] = findPiece(
        startPiece,
        pieces,
        'right',
        'top',
        topPieceValue
        )
      counter += 1
      sorted.push(...pieces.splice(index, 1))

      if (last) {
        startPiece = sorted[sorted.length - counter]
        length = counter
        console.log('Новый ряд')
        break
      } else {
        startPiece = elem
      }
    }
    if (!lastRow) {
      const [elem, index, last] = findPiece(
        startPiece,
        pieces,
        'bottom',
        'left',
        null
      )
      lastRow = last
      startPiece = elem
      sorted.push(...pieces.splice(index, 1))
    } else {
      break
    }
  }
  return sorted.map(elem => elem.id)
}

function initPiece(piece) {
  const [elem, haveSolution] = findRotation(
    piece,
    ['left', 'top'],
    [null, null]
  )
  return elem
}

function findPiece(startPiece, pieces, startPieceDirection, additionalDirection, additionalValue) {
  const firstValue = startPiece['edges'][startPieceDirection]['edgeTypeId']
  for (let index = 0; index < pieces.length; index++) {
    const piece = pieces[index]
    for (const pieceDirection in piece['edges']) {
      if (piece['edges'].hasOwnProperty(pieceDirection) && piece['edges'][pieceDirection] !== null) {
        if (piece['edges'][pieceDirection]['edgeTypeId'] === firstValue) {
          const [elem, haveSolution] = findRotation(
            piece,
            [
              oppositeDirection(startPieceDirection),
              additionalDirection
            ],
            [firstValue, additionalValue]
          )
          if (haveSolution) {
            const last = checkLast(elem, startPieceDirection)
            return [elem, index, last]
          }
        }
      }
    }
  }
}

function oppositeDirection(direction){
  if (direction === 'left') {
    return 'right'
  } else if (direction === 'top') {
    return 'bottom'
  } else if (direction === 'right') {
    return 'left'
  } else if (direction === 'bottom') {
    return 'top'
  }
}

function rotation(piece) {
  const temp = piece['edges']['left']
  piece['edges']['left'] = piece['edges']['top']
  piece['edges']['top'] = piece['edges']['right']
  piece['edges']['right'] = piece['edges']['bottom']
  piece['edges']['bottom'] = temp
  return piece
}

function findRotation(piece, neededDirections, values) {
  console.log(piece)
  let turns = 0
  while (isNeedRotation(piece, neededDirections, values) && turns < 4) {
    piece = rotation(piece)
    turns += 1
  }
  return [piece, turns < 4]
}

function isNeedRotation(piece, neededDirections, values) {
  for (let i = 0; i < neededDirections.length; i++) {
    if (values[i] === null) {
      if (piece['edges'][neededDirections[i]] !== values[i]) {
        return true
      }
    } else if (piece['edges'][neededDirections[i]] === null || piece['edges'][neededDirections[i]]['edgeTypeId'] !== values[i]) {
      return true
    }
  }
  return false
}

function checkLast(piece, direction) {
  return piece['edges'][direction] === null
}

// Не удаляйте эту строку
window.solvePuzzle = solvePuzzle;

