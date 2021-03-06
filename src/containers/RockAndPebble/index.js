import React from 'react'
import { connect } from 'react-redux'
import { setError } from '../../actions'
import RockCard from '../../components/RockCard'
import { activateRockAndPebble} from '../../thunks/activateRockAndPebble'
import { declineRockPebbleRelationship} from '../../thunks/declineRockPebble'
import { discontinueRockPebbleRelationship} from '../../thunks/discontinueRockPebble'
import { rockOptInOut } from '../../thunks/rockOptOut'
import PebbleCard from '../../components/PebbleCard'
import PendingCard from '../../components/PendingCard'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom';

const RockAndPebble = ({ user, 
                         rockandpebbles, 
                         rockOptInOut, 
                         activateRockAndPebble,
                         declineRockPebbleRelationship, 
                         discontinueRockPebbleRelationship}) => {

  const rockOptIn = user.rockOptIn
  const id = user.id
  const pebbles = rockandpebbles.myPebbles
  const rocks = rockandpebbles.myRocks
  const pendingPebbles = rockandpebbles.pendingPebbles
  const pendingRocks = rockandpebbles.pendingRocks


  const handleSubmitRockOptinStatus = async () => {
    await rockOptInOut(id)
  }
  
  return (
    <div className='RockAndPebble'>
      <h2 className='RockAndPebble--h2'>Rock & Pebble</h2>
      <p className='RockAndPebble--explanation'>
        View/Find your Rock (mentor) or Pebble (mentee)
      </p>
      <p className='RockAndPebble--explanation light'>
        e.g. A Mod 2 student would likely be a Rock for Mod 1 student
      </p>
      <section className='RockAndPebble--section'>
        <div className='RockAndPebble--div'>
          <div className='RockAndPebble--header--div'>
            <h2 className='RockAndPebble--header--h2'>Your Rock(s)</h2>
            <div className='RockAndPebble--opt--div'>
            { (rocks?.length > 0 || pendingRocks?.length > 0) && 
              <>
                <NavLink
                  to='rock-listing'
                  className='RockAndPebble--opt--link'
                  activeClassName=''
                >
                  <button className='RockAndPebble--opt--btn'>Find Rocks</button>
                </NavLink>
              </>
            }
            </div>
          </div>
            { !rocks?.length && !pendingRocks?.length ? 
              <>
                <p>You don't have a rock. Let's find one!</p>
                <NavLink
                  to='rock-listing'
                  className='RockAndPebble--btn'
                  activeClassName=''
                >
                  <button className='RockAndPebble--btn'>Get Rockin'</button>
                </NavLink>
              </>
              :
              <>
              <RockCard rocks={rocks} pendingRocks = {pendingRocks} user = {user} discontinueRockPebbleRelationship = {discontinueRockPebbleRelationship}/>
              </>
            } 
        </div>

        <div className='RockAndPebble--div'>
          <div className='RockAndPebble--header--div--pebble'>

            <h2 className='RockAndPebble--header--h2'>Your Pebble(s)</h2>

            <div className='RockAndPebble--opt--div'>
            {rockOptIn ? 
              <button className='RockAndPebble--opt--btn' onClick={() => handleSubmitRockOptinStatus()}>Opt-out</button>
              :
              <button className='RockAndPebble--opt--btn'onClick={() => handleSubmitRockOptinStatus()}>Opt-in</button>
            }
            </div>
          </div>
            { !pebbles?.length ? 
                 <>
                <p>        
                  <span role='img' aria-label='pleading face emoji'>🥺</span>
                  You don't have any pebbles right now. 
                  <span role='img' aria-label='pleading face emoji'>🥺</span>
                </p>
                <p className='RockAndPebble--explanation light'>If you have opted in, keep waiting. If not, opt-in!</p>
              </>
              :
                 <PebbleCard pebbles={pebbles} user = {user} discontinueRockPebbleRelationship = {discontinueRockPebbleRelationship}/> 
                }  
            <div className='RockAndPebble--opt--div'>
              { pebbles && pebbles.length >= 2 &&
                <p> Since you already have two pebbles you will no longer be listed as an available Rock. </p> 
              }
          </div>
        </div>
          { pendingPebbles && pendingPebbles.length >= 1 && 
          <>
            <div className='RockAndPebble--div'>
              <div className="RockAndPebble--header--div">       
                <h2 className='RockAndPebble--header--h2'>Your Pending Pebble(s)</h2>
              </div> 
              <PendingCard pendingPebbles={pendingPebbles} user = {user} activateRockAndPebble = {activateRockAndPebble} declineRockPebbleRelationship = {declineRockPebbleRelationship} />
          </div> 
              </> 
            }
      </section>
    </div>
  )
}

export const mapStateToProps = state => ({
  user: state.user,
  rockandpebbles: state.rockandpebbles,
})

export const mapDispatchToProps = dispatch => ({
  setError: error => dispatch(setError(error)),
  activateRockAndPebble: (rockId, pebbleId) => dispatch(activateRockAndPebble(rockId, pebbleId)),
  declineRockPebbleRelationship: (rockId, pebbleId, reason) => dispatch(declineRockPebbleRelationship(rockId, pebbleId, reason)),
  discontinueRockPebbleRelationship: (rockId, pebbleId, reason, userRelationship) => dispatch(discontinueRockPebbleRelationship(rockId, pebbleId, reason, userRelationship)),
  rockOptInOut: id => dispatch(rockOptInOut(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RockAndPebble)

RockAndPebble.propTypes = {
  setError: PropTypes.func,
  user: PropTypes.object,
  rockandpebbles: PropTypes.object,
  rocks: PropTypes.array,
  pebbles: PropTypes.array,
  rockOptIn: PropTypes.string
}
