import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import chevronDown from '../static/chevron-down.svg'
import chevronUp from '../static/chevron-up.svg'
import lastPage from '../static/last_page.png'
import firstPage from '../static/first_page.png'
import prevPage from "../static/chevron_left.png"
import nextPage from "../static/chevron_right.png"
import { useRecall } from '../RecallContext'

function UsdaListView() {const [dropDownCause, setDropDownCause] = useState(false)
    const [dropDownRisk, setDropDownRisk] = useState(false)
    const [dropDownState, setDropDownState] = useState(false)
    const [dropDownStatus, setDropDownStatus] = useState(false)
    const [dropDownYear, setDropDownYear] = useState(false)
    const [causeOpen, setCauseOpen] = useState(false)
    const [riskOpen, setRiskOpen] = useState(false)
    const [stateOpen, setStateOpen] = useState(false)
    const [statusOpen, setStatusOpen] = useState(false)
    const [yearOpen, setYearOpen] = useState(false)
  
    const [word, setWord] = useState('')
    const [cause, setCause] = useState('')
    const [risk, setRisk] = useState('')
    const [status, setStatus] = useState('')
    const [state, setState] = useState('')
    const [year, setYear] = useState('')
    const [curPage, setCurPage] = useState(1) 
    const [current, setCurrent] = useState(1)
  
    const { fsis: recalls, errorFsis } = useRecall()
    const pageSize = 10
    const stateSize = 5
  
    const returnRecalls = (recalls, curPage, pageSize) => {
      const sortRecall = (x,y) => {
        if(x.field_year>y.field_year) return -1
        if(x.field_year<y.field_year) return 1
    }
      const filterRecall = (recall, idx) => {
        let start = (curPage - 1) * pageSize
        let end = curPage * pageSize
        if (idx >= start && idx < end) return true
      }
      return recalls
        .sort(sortRecall)
        .filter(filterRecall)
    }
  
    const returnEdited = (recalls, word, cause, state, status, risk, year) => {
      const newArray =  recalls
      .filter(x => x.field_recall_reason.includes(cause))
      .filter(x => x.field_states.includes(state))
      .filter(x => risk.length === 0 ? x.field_recall_classification : x.field_recall_classification === risk)
      .filter(x => status.length === 0 ? x.field_recall_type : x.field_recall_type === status)
      .filter(x => year.length === 0 ? x.field_year : x.field_year === year)
      .filter(x => x.field_title.toLocaleLowerCase().includes(word.toLocaleLowerCase()))
      return newArray
    }
 
    const editedRecalls = useMemo(() => returnEdited(recalls, word, cause, state, status, risk, year)
      , [recalls, word, cause, state, status, risk, year])
  
    const filteredRecalls = useMemo(
      () => returnRecalls(
        editedRecalls, curPage, pageSize
      ), [editedRecalls, curPage, pageSize])
  
    let totalPages = Math.ceil(editedRecalls.length / pageSize)
  
    const jumpToPage = useMemo(() => {
      const newArray = []
      for(let i = 1; i <= totalPages; i++) {
        newArray.push(i)
      }
      return newArray
    }, [totalPages])
  
  
  
    const createCauses = () => {
      const newArray = []
      editedRecalls.map(x => x.field_recall_reason).filter(x => x !== "").forEach(x => {
        if (x.includes(',')) {
          newArray.push(...x.split(','))
        } else {
          newArray.push(x)
        }
      })
  
      return Array.from(new Set(newArray.map(x => x.trim())))
    }
  
  
    const createStates = () => {
      const newArray = []
      recalls.map(x => x.field_states).filter(x => x !== "").forEach(x => {
        if (x.includes(',')) {
          newArray.push(...x.split(','))
        } else {
          newArray.push(x)
        }
      })
      return Array.from(new Set(newArray.map(x => x.trim()))).sort((x, y) => {
        if (x > y) return 1
        return -1
      })
    }
  
    const showCause = () => {
      setCauseOpen(prevState => !prevState)
    }
  
    const showRisk = () => {
      setRiskOpen(prevState => !prevState)
    }
  
    const showStates = () => {
      setStateOpen(prevState => !prevState)
    }
  
    const showStatus = () => {
      setStatusOpen(prevState => !prevState)
    }
  
    const showYear = () => {
      setYearOpen(prevState => !prevState)
    }
  
    const onSearch = (e) => {
      setWord(e.target.value)
      setCurPage(1)
    }
  
    const onReset = () => {
      setWord('')
      setCause([])
      setRisk([])
      setState([])
      setStatus([])
      setYear([])
      setCurPage(1)
    }
  
    const handleCause = (e) => {
      const checkedCause = e.target.value
      if (e.target.checked) {
        setCause(checkedCause)
        setCurPage(1)
      } else {
        setCause('')
        setCurPage(1)
      }
    }
    const handleRisk = (e) => {
      const checkedRisk = e.target.value
      if (e.target.checked) {
        setCurPage(1)
        setRisk(checkedRisk)
      } else {
        setRisk('')
        setCurPage(1)
      }
    }
    const handleStatus = (e) => {
      const checkedStatus = e.target.value
      if (e.target.checked) {
        setCurPage(1)
        setStatus(checkedStatus)
      } else {
        setCurPage(1)
        setStatus('')
      }
    }
    
    const handleYear = (e) => {
      const checkedYear = e.target.value
      if (e.target.checked) {
        setCurPage(1)
        setYear(checkedYear)
      } else {
        setYear('')
        setCurPage(1)
      }
    }
    const changePage = (e) => {
      setCurPage(+e.target.value)
    }
    const viewNextPage = () => {
      setCurPage(curPage + 1)
    }
    const viewPreviousPage = () => {
      setCurPage(curPage - 1)
    }
  
    const viewFirstPage = () => {
      setCurPage(1)
    }
  
    const viewLastPage = () => {
      setCurPage(totalPages)
    }

    const scrollUp = () => {
      setCurrent(current - 1)
    }
    const scrollDown = () => {
      setCurrent(current + 1)
    }

    const states = createStates()
    let totalView = Math.ceil(states.length/ stateSize)

    const returnStates = (states, current, stateSize, state) => {
      const filterState = (state, idx) => {
        let start = (current - 1) * stateSize
        let end = current * stateSize
        if (idx >= start && idx < end) return true
      }
      return states
        .filter(filterState)
    }

    const filteredStates = useMemo(
      () => returnStates(
        states, current, stateSize
      ), [states, current, stateSize])

      const handleState = (e) => {
        const checkedState = e.target.value
        if (e.target.checked) {
          const index = states.findIndex(x => x === checkedState)
          if(index === 0) { setCurrent(1)}
          if(index > 0) { 
            setCurrent(Math.ceil((index+1)/stateSize))}
          setState(checkedState)
          setCurPage(1)
        } else {
          setState('')
          setCurrent(1)
          setCurPage(1)
        }
      }
 
  
  
    return (
      <>
      {errorFsis === 'Network Error' && <div>Check your internet connection!</div>}
      {recalls.length === 0 && errorFsis === '' && <div className='spinner'></div>}
      {recalls.length > 0  && <div className='view-recalls'>
        <div className='search-filter'>
          <div className="search">
            <div className='search-filter-heading'>Search Results</div>
            <div className='form'>
              <form>
                <input value={word} placeholder='Type in keyword' onChange={onSearch} type="text" />
              </form>
            </div>
            <button onClick={onReset} className='btn'>Reset</button>
          </div>
          <div className="filter">
            <div className='search-filter-heading'>Advanced Filter</div>
            <div className="filter-param">
              <div onClick={() => {
                setDropDownCause(!dropDownCause)
                setDropDownRisk(false)
                setDropDownState(false)
                setDropDownStatus(false)
                setDropDownYear(false)
                setRiskOpen(false)
                setStateOpen(false)
                setStatusOpen(false)
                setYearOpen(false)
                showCause()
              }} className='cause'>Cause
                {dropDownCause ? <img src={chevronUp} alt="chevron-up" /> : <img src={chevronDown} alt="chevron-down" />}</div>
              {causeOpen && <div className='options'>
                {createCauses().map((reason, idx) => (
                  <div key={idx} className='options-group'>
                    <div><input
                      checked={cause.includes(reason)}
                      onChange={handleCause} type="checkbox" value={reason} name={reason} id={reason} /></div>
                    <div><label htmlFor={reason}>{reason}</label></div>
                  </div>
                ))}
  
              </div>}
            </div>
            <div className="filter-param">
              <div onClick={() => {
                setDropDownCause(false)
                setDropDownRisk(!dropDownRisk)
                setDropDownState(false)
                setDropDownStatus(false)
                setDropDownYear(false)
                setCauseOpen(false)
                setStateOpen(false)
                setStatusOpen(false)
                setYearOpen(false)
                showRisk()
              }} className='cause'>Risk Level
                {dropDownRisk ? <img src={chevronUp} alt="chevron-up" /> : <img src={chevronDown} alt="chevron-down" />}</div>
              {riskOpen && <div className='options'>
                {Array.from(new Set(editedRecalls.map(x => x.field_recall_classification))).map((reason, idx) => (
                  <div key={idx} className='options-group'>
                    <div><input
                      checked={risk.includes(reason)}
                      onChange={handleRisk} type="checkbox" value={reason} name={reason} id={reason} /></div>
                    <div><label htmlFor={reason}>{reason}</label></div>
                  </div>
                ))}
  
              </div>}
            </div>
            <div className="filter-param">
              <div onClick={() => {
                setDropDownCause(false)
                setDropDownRisk(false)
                setDropDownState(false)
                setDropDownStatus(!dropDownStatus)
                setDropDownYear(false)
                setRiskOpen(false)
                setStateOpen(false)
                setCauseOpen(false)
                setYearOpen(false)
                showStatus()
              }} className='cause'>Status
                {dropDownStatus ? <img src={chevronUp} alt="chevron-up" /> : <img src={chevronDown} alt="chevron-down" />}</div>
              {statusOpen && <div className='options'>
                {Array.from(new Set(editedRecalls.map(x => x.field_recall_type))).map((reason, idx) => (
                  <div key={idx} className='options-group'>
                    <div><input
                      checked={status.includes(reason)}
                      onChange={handleStatus} type="checkbox"
                      value={reason} name={reason} id={reason} /></div>
                    <div><label htmlFor={reason}>{reason}</label></div>
                  </div>
                ))}
  
              </div>}
            </div>
            <div className="filter-param">
              <div onClick={() => {
                setDropDownCause(false)
                setDropDownRisk(false)
                setDropDownState(!dropDownState)
                setDropDownStatus(false)
                setDropDownYear(false)
                setRiskOpen(false)
                setCauseOpen(false)
                setStatusOpen(false)
                setYearOpen(false)
                showStates()
              }} className='cause' id='states'>States
                {dropDownState ? <img src={chevronUp} alt="chevron-up" /> : <img src={chevronDown} alt="chevron-down" />}</div>
              {stateOpen && <div className='options'>
                {current > 1 && <button onClick={scrollUp} className='btn'>
                  <img src={chevronUp} alt="chevron-up" />
                </button>}
                {filteredStates.map((reason, idx) => (
                  <div key={idx} className='options-group'>
                    <div><input
                      checked={state.includes(reason)}
                      onChange={handleState} type="checkbox" value={reason} name={reason} id={reason} /></div>
                    <div><label htmlFor={reason}>{reason}</label></div>
                  </div>
                ))}
                  {current < totalView && <button onClick={scrollDown} className='btn'>
                    <img src={chevronDown} alt="chevron-down" />
                  </button>}
              </div>}
            </div>
            <div className="filter-param">
              <div onClick={() => {
                setDropDownCause(false)
                setDropDownRisk(false)
                setDropDownState(false)
                setDropDownStatus(false)
                setDropDownYear(!dropDownYear)
                setRiskOpen(false)
                setStateOpen(false)
                setStatusOpen(false)
                setCauseOpen(false)
                showYear()
              }} className='cause' id='year'>Year
                {dropDownYear ? <img src={chevronUp} alt="chevron-up" /> : <img src={chevronDown} alt="chevron-down" />}</div>
              {yearOpen && <div className='options'>
                {Array.from(new Set(editedRecalls.map(x => x.field_year))).sort((x, y) => {
                  if (x > y) return -1
                  return 1
                }).map((reason, idx) => (
                  <div key={idx} className='options-group'>
                    <div><input
                      onChange={handleYear}
                      checked={year.includes(reason)} type="checkbox" value={reason} name={reason} id={reason} /></div>
                    <div><label htmlFor={reason}>{reason}</label></div>
                  </div>
                ))}
  
              </div>}
            </div>
          </div>
        </div>
        <>
        {filteredRecalls.length === 0 ? <div className='not-found'>No Recalls Found!</div> : filteredRecalls.map((recall, idx) => (
          <Link to={`/recalls/usda/${recall.field_recall_number}`} key={idx} className="recall-list">
            <div className='recall-title'>
              {recall.field_title}
            </div>
            {!!recall.field_establishment.length && <div className='company'><span>Company:</span>&nbsp;{recall.field_establishment}</div>}
            <div className='recall-group'>
              <div className='risk-level'><span>Risk:</span>&nbsp;{recall.field_recall_classification}</div>
              <div className='recall-cause'><span>Cause:</span>&nbsp;{recall.field_recall_reason}</div>
              <div className='recall-status'><span>Status:</span>&nbsp;{recall.field_recall_type}</div>
            </div>
            <div className='recall-details'>
              <div className='recall-date'><span>Date:</span>&nbsp; {recall.field_recall_date}</div>
              {!!recall.field_states.length && <div className='recall-states'><span>Distribution Area:</span>&nbsp; {recall.field_states}</div>}
            </div>
          </Link>
        ))}
        <div className='jump'>
          <label htmlFor="jump">Jump to page:</label>
          <select onChange={changePage} name="jump" id="jump">
            {jumpToPage.map((page, idx) => (
              <option selected={page === curPage} key={idx} value={page} name={page} id={page}>{page}</option>
            ))}
          </select>
        </div>
        <div className="button-controls">
          <button disabled={curPage === 1 ? true : false} onClick={viewFirstPage} className="btn btn-controls" id="firstPage">
            <img src={firstPage} alt="first_page" />
          </button>
          <button disabled={curPage === 1 ? true : false} onClick={viewPreviousPage} className="btn btn-controls" id="prevButton">
            <img src={prevPage} alt="prev_page" />
          </button>
          <div className="pages">
            <span className="current">{curPage}</span>
            <span>of</span>
            <span className="total_pages">{totalPages}</span>
          </div>
          <button disabled={curPage === totalPages ? true : false} onClick={viewNextPage} className="btn btn-controls" id="nextButton">
            <img src={nextPage} alt="next_page" />
          </button>
          <button disabled={curPage === totalPages ? true : false} onClick={viewLastPage} className="btn btn-controls" id="lastPage">
            <img src={lastPage} alt="last_page" />
          </button>
        </div>
        </>

      </div>}
      
      </>
    )
  }

export default UsdaListView