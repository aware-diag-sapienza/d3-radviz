export function meanDistance(set) {
  const entriesSum = set[0].map((_, entryIndex) => 
    [...new Array(set.length)].map((_, dimensionIndex) =>
      set[dimensionIndex][entryIndex]
    )
  ).map(valueDimensions => valueDimensions.reduce((sumValues, currentValue) => sumValues + currentValue))
  console.log('set', set)
  console.log('entriesSum', entriesSum)
  const dimensionsSum = set.map(dimension => dimension.reduce((a, b) => a + b, 0))
  const dimensionsByRank = dimensionsSum.map((sum, i) => ({i, sum})).sort((a,b) => a.sum <= b.sum ? 1 : -1).map(o => o.i)
  const normalizedSet = set.map(dimensionValues => dimensionValues.map((entryValue, entryIndex) => entriesSum[entryIndex] > 0 ? entryValue / entriesSum[entryIndex] : 0))
  let availablePositions = [...new Array(set.length)].map((_, i) => i)
  const assignedPositions = []
  console.log('dimensionsSum', dimensionsSum)
  console.log('dimensionsByRank', dimensionsByRank)
  console.log('normalizedSet', normalizedSet)
  console.log('availablePositions', availablePositions)
  console.log('--- END INIT ---')
  let pointsAssignedPositions = [...new Array(set[0].length)].map(_ => [0, 0])
  const arrangement = [...new Array(set.length)].fill(null)
  for (const [rankIndex, dimensionIndex] of dimensionsByRank.entries()) {
    let currentPosition
    if (rankIndex === 0) {
      currentPosition = 0
    }
    else if (rankIndex === dimensionsByRank.length - 1) {
      currentPosition = availablePositions[0]
    }
    else {
      let currentDimensionValues = normalizedSet[dimensionIndex]
      let othersDimensionsByRank = dimensionsByRank.slice(rankIndex + 1)
      let othersDimensionsValues = othersDimensionsByRank.map(otherDimensionIndex => normalizedSet[otherDimensionIndex])
      let othersMeanValues = othersDimensionsValues[0].map((_, entryIndex) => 
        othersDimensionsByRank.map((_, otherDimensionIndex) => 
          othersDimensionsValues[otherDimensionIndex][entryIndex]
        )
      ).map(valueDimensions => valueDimensions.reduce((sumValues, currentValue) => 
        sumValues + currentValue) / othersDimensionsByRank.length
      )
      console.log('currentDimensionValues', currentDimensionValues)
      console.log('othersDimensionsByRank', othersDimensionsByRank)
      console.log('othersDimensionsValues', othersDimensionsValues)
      console.log('othersMeanValues', othersMeanValues)
      let currentMagnitude = -Infinity
      for (const possiblePosition of availablePositions) {
        console.log('possiblePosition', possiblePosition)
        let otherPositions = availablePositions.filter(pos => pos !== possiblePosition)
        console.log('otherPositions', otherPositions)
        let pointsPossiblePositions = pointsAssignedPositions.map(point => point.slice())
        pointsPossiblePositions = pointsPossiblePositions.map(([x1, x2], entryIndex) => [
          x1 + normalizedSet[dimensionIndex][entryIndex] * Math.cos(2 * Math.PI * possiblePosition / set.length), 
          x2 + normalizedSet[dimensionIndex][entryIndex] * Math.sin(2 * Math.PI * possiblePosition / set.length)
        ])
        for (const otherPosition of otherPositions) {
          pointsPossiblePositions = pointsPossiblePositions.map(([x1, x2], entryIndex) => [
            x1 + othersMeanValues[entryIndex] * Math.cos(2 * Math.PI * otherPosition / set.length), 
            x2 + othersMeanValues[entryIndex] * Math.sin(2 * Math.PI * otherPosition / set.length)
          ])
        }
        console.log('pointsPossiblePositions', pointsPossiblePositions)
        let possibleMagnitude = pointsPossiblePositions.map(([x1, x2]) => Math.sqrt(Math.pow(x1, 2) + Math.pow(x2, 2))).reduce((p, c) => p + c, 0) / pointsPossiblePositions.length
        console.log('possibleMagnitude', possibleMagnitude)
        if (possibleMagnitude > currentMagnitude) {
          currentPosition = possiblePosition
          currentMagnitude = possibleMagnitude
        }
      }
      console.log('currentPosition', currentPosition)
    }
    arrangement[currentPosition] = dimensionIndex
    assignedPositions.push(currentPosition)
    availablePositions.splice(availablePositions.indexOf(currentPosition), 1)
    pointsAssignedPositions = pointsAssignedPositions.map(([x1, x2], entryIndex) => [
      x1 + normalizedSet[dimensionIndex][entryIndex] * Math.cos(2 * Math.PI * currentPosition / set.length), 
      x2 + normalizedSet[dimensionIndex][entryIndex] * Math.sin(2 * Math.PI * currentPosition / set.length)
    ])
    console.log('availablePositions', availablePositions)
    console.log('pointsAssignedPositions', pointsAssignedPositions)
    console.log('arrangement', arrangement)
  }
  return arrangement
}