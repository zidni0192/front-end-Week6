import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getBook } from '../publics/redux/action/book'
import { deleteBook } from '../publics/redux/action/book'
import ModalAlert from './ModalAlert'
function convert(date) {
  let data = Date.parse(date)
  let newDate = new Date(data)
  let day = newDate.getDate()
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let month = months[newDate.getMonth()]
  var year = newDate.getFullYear();
  return `${day} ${month} ${year}`
}
class BookDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      book: [],
      modal: ""
    }
  }
  setModal = () => {
    this.setState({ modal: "" })
  }
  componentDidMount = async () => {
    console.log(this.props)
    await this.props.dispatch(getBook(this.props.match.params.bookid))
    await new Promise(resolve => setTimeout(resolve, 500))
    this.setState({
      book: this.props.book
    })
  }
  deleteData = () => {
    this.props.dispatch(deleteBook(this.props.match.params.bookid))
    this.props.showModalDelete()
  }
  pinjam = () => {
    if (localStorage.id) {
      this.props.showModalPinjam()
    } else {
      const modal = <ModalAlert show={true} pesan={"Login Dulu Dong"} error={true} link={"/login"} setModal={this.setModal} />
      this.setState({ modal: modal })
    }
  }
  render() {
    const book = this.state.book.bookEdit
    console.log(book)
    return (
      <div className="book-detail">
        {this.state.modal}
        <div>
          <ul>
            <li><Link to="/" className="back">&lArr;</Link></li>
            {localStorage.role === "Librarian" ? <li className="button" onClick={this.props.showModal}>Edit</li> : ""}
            {localStorage.role === "Librarian" ? <li className="button" onClick={this.deleteData}>Delete</li> : ""}
          </ul>
          <div className={'imageHeader'}>
            <img className={'imageHeader'} src={book ? book.result.image_url : ""} alt={book ? book.result.title : ""} />
          </div>
        </div>
        <div className="content">
          <img className={'imageBook'} src={book ? book.result.image_url : ""} alt={book ? book.result.title : ""} />
          <button className={"btn-pinjam"} onClick={this.pinjam}>Pinjam </button>
          <p className="title">{book ? book.result.title : ""}</p>
          <p className="date">{book ? convert(book.result.updated_at) : ""}</p>
          <p className="category">Category : {book ? book.result.category : ""}</p>
          <p className="writer"> Penulis : {book ? book.result.writer : ""}</p>
          <p className="text">{book ? book.result.description : ""}</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    book: state.book,
    user: state.user
  }
}

export default connect(mapStateToProps)(BookDetail)