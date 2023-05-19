export class SudokuG {
    constructor(hints,limit) {

      this.hints=hints
      this.limit = limit || 10000

      this.numbers = () =>
        new Array(9)
          .join(" ")
          .split(" ")
          .map((num , i) => i + 1)
      this.randomRow = () => {
        var row = []
        var numbers = this.numbers()
        while (row.length < 9) {
          var index = Math.floor(Math.random() * numbers.length)
          row.push(numbers[index])
          numbers.splice(index, 1)
        }

        return row
      }
      this.result = new Array(9 * 9)
        .join(" ")
        .split(" ")
        .map(entry => null)

      this.map = new Array(9 * 9)
        .join(" ")
        .split(" ")
        .map(path => this.randomRow())

      this.stack = []

      return this
    }
  
    toRows(arr) {
      var row = 0
      var asRows = new Array(9)
        .join(" ")
        .split(" ")
        .map(row => [])
  
      for (let [index, entry] of arr.entries()) {
        asRows[row].push(entry)

        if ( !((index + 1) % 9) ) {
          row += 1
        }
      }

      return asRows
    }


    getBoard() {
      return this.toRows(this.substractCells())
    }

    getSolution() {
      return this.toRows(this.result)
    }

    substractCells() {
      var _getNonEmptyIndex = () => {
        var index = Math.floor(Math.random() * _result.length)
        return _result[index] ? index : _getNonEmptyIndex()
      }

      var _result = this.result.filter(() => true)

      while (
        _result.length - this.hints >
        _result.filter(n => !n).length
      ) {
        _result[_getNonEmptyIndex()] = 0
      }

      return _result
    }
  
    validate(map, number, index) {
      var rowIndex = Math.floor(index / 9)
      var colIndex = index % 9

      var row = map.slice(
        rowIndex * 9, 9 * (rowIndex + 1)
      )

      var col = map.filter((e, i) =>
        i % 9 === colIndex
      )

      var boxRow = Math.floor(rowIndex / 3)
      var boxCol = Math.floor(colIndex / 3)

      var box = map.filter((e, i) =>
        Math.floor(Math.floor(i / 9) / 3) === boxRow &&
        Math.floor((i % 9) / 3) === boxCol
      )

      return {
        row: {
          first: row.indexOf(number),
          last: row.lastIndexOf(number)
        },
        col: {
          first: col.indexOf(number),
          last: col.lastIndexOf(number)
        },
        box: {
          first: box.indexOf(number),
          last: box.lastIndexOf(number)
        }
      }
    }

    _validate(map, index) {
      if (!map[index].length) {
        return false
      }

      this.stack.splice(index, this.stack.length)
  
      var path = map[index]
      var number = path[path.length - 1]
  
      var didFoundNumber = this.validate(this.stack, number, index)
  
      return (
        didFoundNumber.col.first === -1 &&
        didFoundNumber.row.first === -1 &&
        didFoundNumber.box.first === -1
      )
    }

    _generate(map, index) {
      if (index === 9 * 9) {
        return true
      }

      if (--this.limit < 0) {
        return false
      }

      var path = map[index]

      if (!path.length) {
        map[index] = this.numbers()
        map[index - 1].pop()
        return false
      }

      var currentNumber = path[path.length - 1]

      var isValid = this._validate(map, index)
      if (!isValid) {
        map[index].pop()
        map[index + 1] = this.numbers()
        return false
      } else {
        this.stack.push(currentNumber)
      }

      for (let number of path.entries()) {
        if (this._generate(map, index + 1)) {
          this.result[index] = currentNumber
          return true
        }
      }

      return false
    }

    generate() {
      if (this._generate(this.map, 0)) {
        this.success = true
      }
      return this
    }

  }



