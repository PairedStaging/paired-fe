import React, { Component } from 'react';
import { Dropdown } from '../../components/Dropdown';
import * as gql from '../../queries';
import * as fetch from '../../utils';
import { setError, setAvailPairings } from '../../actions';
import { connect } from 'react-redux';
import { Pairings } from '../../components/Pairings';
import { getDatesToDisplay } from '../../helpers';

export class Controls extends Component {
  constructor() {
    super();
    this.state = {
      program: '',
      module: '',
      date: '',
      message: ''
    };
  }

  handleChange = event => {
    let { value, name } = event.target;
    name = name.toLowerCase();
    this.setState({ [name]: value });
  };

  handleClick = async () => {
    const { program, module, date } = this.state;
    try {
      const body = gql.getAvailablePairings(program, parseInt(module), date);
      const response = await fetch.fetchData(body);
      if (response.getAvailablePairings.length) {
        this.setState({ message: '' });
        this.props.setAvailPairings(response.getAvailablePairings);
      } else {
        this.setState({
          message: `Sorry no pairings are available for ${program} Mod ${module} on ${date}`
        });
      }
    } catch (error) {
      this.props.setError(error.message);
    }
  };

  checkDropdowns = () => {
    const { program, module, date } = this.state;
    return !program || !module || !date;
  };

  render() {
    const dates = getDatesToDisplay(5);
    const { availPairings } = this.props;
    const { message } = this.state;
    return (
      <div className='Controls'>
        <h2>Book a Pairing</h2>
        <section className='Controls--section'>
          <Dropdown
            options={['FE', 'BE']}
            label='Program'
            handleChange={this.handleChange}
          />
          <Dropdown
            options={['1', '2', '3', '4']}
            label='Module'
            handleChange={this.handleChange}
          />
          <Dropdown
            options={dates}
            label='Date'
            handleChange={this.handleChange}
          />
        </section>
        <button
          onClick={this.handleClick}
          className='Controls--avail-btn'
          disabled={this.checkDropdowns()}>
          Show Available Pairings
        </button>
        {message !== '' && <p>{message}</p>}
        {availPairings.length !== 0 && (
          <Pairings openPairings={availPairings} history={this.props.history} />
        )}
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  availPairings: state.availPairings
});

export const mapDispatchToProps = dispatch => ({
  setError: error => dispatch(setError(error)),
  setAvailPairings: pairings => dispatch(setAvailPairings(pairings))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls);
