import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import statesFile from '../states/states.json'
import chevronDown from '../static/chevron-down.svg'
import chevronUp from '../static/chevron-up.svg'
import lastPage from '../static/last_page.png'
import firstPage from '../static/first_page.png'
import prevPage from "../static/chevron_left.png"
import nextPage from "../static/chevron_right.png"
import { useRecall } from '../RecallContext'

function FdaListView() {const [dropDownRisk, setDropDownRisk] = useState(false)
    const [dropDownState, setDropDownState] = useState(false)
    const [dropDownStatus, setDropDownStatus] = useState(false)
    const [dropDownYear, setDropDownYear] = useState(false)
    const [riskOpen, setRiskOpen] = useState(false)
    const [stateOpen, setStateOpen] = useState(false)
    const [statusOpen, setStatusOpen] = useState(false)
    const [yearOpen, setYearOpen] = useState(false)
  
    const [word, setWord] = useState('')
    const [risk, setRisk] = useState('')
    const [status, setStatus] = useState('')
    const [state, setState] = useState('')
    const [year, setYear] = useState('')
    const [curPage, setCurPage] = useState(1)
    const [current, setCurrent] = useState(1)
  
    const { fda: recalls, errorFda } = useRecall()
    const pageSize = 10
    const stateSize = 5
    
    const states = Object.keys(statesFile).sort()
    let totalView = Math.ceil(states.length/ stateSize)
   
  
    const returnEdited = (recalls, word, state, status, risk, year) => {
      const newArray =  recalls
      .filter(x => state.length === 0 ? x.distribution_pattern : 
        (x.distribution_pattern.toLowerCase().includes(state.toLowerCase()) || x.distribution_pattern.includes(states[state])))
      .filter(x => risk.length === 0 ? x.classification : x.classification === risk)
      .filter(x => status.length === 0 ? x.status : x.status=== status)
      .filter(x => year.length === 0 ? x.report_date : x.report_date.substring(0,4) === year)
      .filter(x => x.reason_for_recall.toLocaleLowerCase().includes(word.toLocaleLowerCase()))
      return newArray
    }
  
    const returnRecalls = (recalls, curPage, pageSize) => {
      const sortRecall = (x,y) => {
        if(x.report_date>y.report_date) return -1
        if(x.report_date<y.report_date) return 1
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
  
    const editedRecalls = useMemo(() => returnEdited(recalls, word, state, status, risk, year)
      , [recalls, word, state, status, risk, year])
  
    const filteredRecalls = useMemo(() => returnRecalls(editedRecalls, curPage, pageSize), [editedRecalls, curPage, pageSize])
  
    let totalPages = Math.ceil(editedRecalls.length / pageSize)
  
    const jumpToPage = useMemo(() => {
      const newArray = []
      for(let i = 1; i <= totalPages; i++) {
        newArray.push(i)
      }
      return newArray
    }, [totalPages])
  
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
      setRisk([])
      setState([])
      setStatus([])
      setYear([])
      setCurPage(1)
    }
  
    const handleRisk = (e) => {
      const checkedRisk = e.target.value
      if (e.target.checked) {
        setRisk(checkedRisk)
        setCurPage(1)
      } else {
        setRisk('')
        setCurPage(1)
      }
    }
  
    const handleStatus = (e) => {
      const checkedStatus = e.target.value
      if (e.target.checked) {
        setStatus(checkedStatus)
        setCurPage(1)
      } else {
        setStatus('')
        setCurPage(1)
      }
    }

    const scrollUp = () => {
      setCurrent(current - 1)
    }
    const scrollDown = () => {
      setCurrent(current + 1)
    }


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
      console.log(checkedState)
      if (e.target.checked) {
        const index = states.findIndex(x => x === checkedState)
          if(index === 0) { setCurrent(1)}
          if(index > 0) { 
            setCurrent(Math.ceil((index+1)/stateSize))}
          setState(checkedState)
        setCurPage(1)
      } else {
        setState('')
        setCurPage(1)
      }
    }
    const handleYear = (e) => {
      const checkedYear = e.target.value
      if (e.target.checked) {
        setYear(checkedYear)
        setCurPage(1)
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
  
    return (
      <>
      {errorFda === 'Network Error' && <div>Check your internet connection!</div>}
      {recalls.length === 0 && errorFda === '' && <div className='spinner'></div>}
      {recalls.length > 0  && <div>
        <div className='search-filter'>
        <div className="search">
        <div className='search-filter-heading'>Search Results</div>
            <div className='form'>
              <form>
              <input onChange={onSearch} value={word} placeholder='Type in keyword' type="text" />
              </form>
            </div>
            <button onClick={onReset} className='btn'>Reset</button>
          </div>
          <div className="filter">
            
        <div className="filter">
        <div className='search-filter-heading'>Advanced Filter</div>
        <div className="filter-param">
          <div onClick={() => {
                setDropDownRisk(!dropDownRisk)
                setDropDownState(false)
                setDropDownStatus(false)
                setDropDownYear(false)
                setStateOpen(false)
                setStatusOpen(false)
                setYearOpen(false)
                showRisk()
              }} className='cause'>Risk Level 
          {dropDownRisk ? <img src={chevronUp} alt="chevron-up" /> : <img src={chevronDown} alt="chevron-down" />}</div>
          {riskOpen && <div className='options'>
            {Array.from(new Set(editedRecalls.map(x => x.classification))).sort((x, y) => {
                  if (x < y) return -1
                  return 1
                }).map((fieldRisk, idx) => (
              <div key={idx} className='options-group'>
                <div><input
                checked={risk.includes(fieldRisk)}
                onChange={handleRisk}
                       type="checkbox" value={fieldRisk} name={fieldRisk} id={fieldRisk} /></div>
                    <div><label htmlFor={fieldRisk}>{fieldRisk}</label></div>
              </div>
            ))}
          </div>}
          </div>
          <div className="filter-param">
          <div
          onClick={() => {
            setDropDownRisk(false)
            setDropDownState(false)
            setDropDownStatus(!dropDownStatus)
            setDropDownYear(false)
            setRiskOpen(false)
            setStateOpen(false)
            setYearOpen(false)
            showStatus()
          }} className='cause'>Status 
          {dropDownStatus ? <img src={chevronUp} alt="chevron-up" /> : <img src={chevronDown} alt="chevron-down" />}</div>
          {statusOpen && <div className='options'>
            {Array.from(new Set(editedRecalls.map(x => x.status))).map((fieldStatus, idx) => (
              <div key={idx} className='options-group'>
                <div><input
                      checked={status.includes(fieldStatus)}
                      onChange={handleStatus}
                       type="checkbox" value={fieldStatus} name={fieldStatus} id={fieldStatus} /></div>
                    <div><label htmlFor={fieldStatus}>{fieldStatus}</label></div>
              </div>
            ))}
          </div>}
          </div>
          <div className="filter-param">
          <div
          onClick={() => {
            setDropDownRisk(false)
            setDropDownState(!dropDownState)
            setDropDownStatus(false)
            setDropDownYear(false)
            setRiskOpen(false)
            setStatusOpen(false)
            setYearOpen(false)
            showStates()
          }} className='cause' id='states'>States
          {dropDownState ? <img src={chevronUp} alt="chevron-up" /> : <img src={chevronDown} alt="chevron-down" />}</div>
          {stateOpen && <div className='options'>
          {current > 1 && <button onClick={scrollUp} className='btn'>
                  <img src={chevronUp} alt="chevron-up" />
                </button>}
            {filteredStates.map((st, idx) => (
              <div key={idx} className='options-group'>
                <div><input
                checked={state.includes(st)}
                onChange={handleState}
                       type="checkbox" value={st} name={st} id={st} /></div>
                    <div><label htmlFor={st}>{st}</label></div>
              </div>
            ))}
            {current < totalView && <button onClick={scrollDown} className='btn'>
                    <img src={chevronDown} alt="chevron-down" />
                  </button>}
          </div>}
          </div>
          <div className="filter-param">
          <div onClick={() => {
                setDropDownRisk(false)
                setDropDownState(false)
                setDropDownStatus(false)
                setDropDownYear(!dropDownYear)
                setRiskOpen(false)
                setStateOpen(false)
                setStatusOpen(false)
                showYear()
              }} className='cause' id='year'>Year 
          {dropDownYear ? <img src={chevronUp} alt="chevron-up" /> : <img src={chevronDown} alt="chevron-down" />}</div>
          {yearOpen && <div className='options'>
            {Array.from(new Set(editedRecalls.map(x => x.report_date.substring(0,4)))).sort((x, y) => {
                  if (x > y) return -1
                  return 1
                }).map((risk, idx) => (
              <div key={idx} className='options-group'>
                <div><input
                onChange={handleYear}
                checked={year.includes(risk)}
                       type="checkbox" value={risk} name={risk} id={risk} /></div>
                    <div><label htmlFor={risk}>{risk}</label></div>
              </div>
            ))}
          </div>}
          </div>
        </div>
          </div>
        </div>
        
        <>
        {filteredRecalls.length === 0 ? <div className='not-found'>No Recalls Found!</div> : filteredRecalls.map((recall, idx) => (
          <Link to={`/recalls/fda/${recall.recall_number}`} key={idx} className="recall-list">
          <div className='recall-title'><div>{recall.reason_for_recall}</div>
          <div>{recall.product_description}</div></div>
          <div className='company'><span>Company:</span>&nbsp;{recall.recalling_firm}</div>
          <div className='recall-group'>
            <div className='risk-level'><span>Risk:</span>&nbsp;{recall.classification}</div>
            <div className='recall-status'><span>Status:</span>
            &nbsp;{recall.status}</div>
          </div>
          <div className='recall-details'>
              <div className='recall-date'>
                <span>Date:</span>&nbsp;
                {recall.report_date.substring(0,4)+'-'
                +recall.report_date.substring(4,6)+'-'
                +recall.report_date.substring(6) }</div> 
              <div className='recall-states'><span>Distribution Area:</span>&nbsp; {recall.distribution_pattern}</div>
            </div>
        </Link>
        ))}
        <div className='jump'>
          <label htmlFor="jump">Jump to page:</label>
          <select onChange={changePage} name="jump" id="jump">
            {jumpToPage.map((page, idx) => (
              <option selected={page === curPage} key={idx} value={page} name={page} >{page}</option>
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

export default FdaListView