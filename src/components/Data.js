import React from "react";

export class Pagination extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentPage: null,
      pageCount: null,
    };
  }

  componentWillMount() {
    const startingPage = this.props.startingPage ? this.props.startingPage : 1;
    const data = this.props.data;
    const pageSize = this.props.pageSize;
    let pageCount = parseInt(data.length / pageSize);
    if (data.length % pageSize > 0) {
      pageCount++;
    }
    this.setState({
      currentPage: startingPage,
      pageCount: pageCount,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      const startingPage = this.props.startingPage
        ? this.props.startingPage
        : 1;
      const data = this.props.data;
      const pageSize = this.props.pageSize;
      let pageCount = parseInt(data.length / pageSize);
      if (data.length % pageSize > 0) {
        pageCount++;
      }
      this.setState({
        currentPage: startingPage,
        pageCount: pageCount,
      });
    }
  }

  setCurrentPage(num) {
    this.setState({ currentPage: num });
  }

  createControls() {
    let controls = [];
    const pageCount = this.state.pageCount;
    for (let i = 1; i <= pageCount; i++) {
      const baseClassName = "pagination-controls__button";
      const activeClassName =
        i === this.state.currentPage ? `${baseClassName}--active` : "";
      controls.push(
        <div
          className={`${baseClassName} ${activeClassName}`}
          onClick={() => this.setCurrentPage(i)}
        >
          {i}
        </div>
      );
    }
    return controls;
  }

  createPaginatedData() {
    const data = this.props.data;
    const pageSize = this.props.pageSize;
    const currentPage = this.state.currentPage;
    const upperLimit = currentPage * pageSize;
    const dataSlice = data.slice(upperLimit - pageSize, upperLimit);
    return dataSlice;
  }

  render() {
    return (
      <div className="pagination">
        <div className="pagination-results">
          {React.cloneElement(this.props.children, {
            data: this.createPaginatedData(),
          })}
        </div>
        <div className="pagination-controls">{this.createControls()}</div>
      </div>
    );
  }
}

export class AllData extends React.Component {
  render() {
    const data = this.props.data;
    return (
      <div>
        <div className="box-container">
          {data.map((item, i) => {
            return (
              <div key={i} className="box">
                <b>Name: </b>
                {item.FirstName} {item.LastName}
                <br />
                <b>UserName: </b>
                {item.UserName}
                <br />
                <b>Gender: </b>
                {item.Gender}
                <br />
                <b>Email: </b>
                {item.Email}
                <br />
                <b>CreditCard Type: </b>
                {item.CreditCardType}
                <br />
                <b>URL: </b>
                {item.URL}
                <br />
                <b>Domain Name: </b>
                {item.DomainName}
                <br />
                <b>Payment Method: </b>
                {item.PaymentMethod}
              </div>
            );
          })}
          <div className="clearboth"></div>
          {!data && <span>No records found to display!</span>}
        </div>
      </div>
    );
  }
}
