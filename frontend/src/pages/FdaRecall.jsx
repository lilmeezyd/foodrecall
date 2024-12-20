import { useParams } from 'react-router-dom'
import { useRecall } from '../RecallContext'


function FdaRecall() {

  const{ fda: recalls, errorFsis } = useRecall()
    const {fdaId} = useParams()
    const recall = recalls.find(recall => recall.event_id === fdaId)
  return (
    <>
    {errorFsis === 'Network Error' && <div>Check your internet connection!</div>}
    {recalls.length === 0 && errorFsis === '' && <div className='spinner'></div>}
    {!recall && recalls.length > 0 ? <p>Recall not found!</p> : 
    <>
    {!!recall && <div className="recall-list-1">
    <div className='recall-title'>{recall?.reason_for_recall}</div>
    <div className='company'><span>Company:</span>&nbsp;{recall?.recalling_firm}</div>
    <div className='recall-group'>
      <div className='risk-level'><span>Risk:</span>&nbsp;{recall?.classification}</div>
      <div className='recall-status'><span>Status:</span>
      &nbsp;{recall?.status}</div>
    </div>
    <div className='recall-details'>
        <div className='recall-date'>
          <span>Date:</span>&nbsp;
          {recall?.report_date?.substring(0,4)+'-'
          +recall?.report_date?.substring(4,6)+'-'
          +recall?.report_date?.substring(6) }</div>
        <div className='recall-states'><span>Distribution Area:</span>&nbsp; {recall?.distribution_pattern}</div>
        <div><span>Recall Number:</span>&nbsp;{recall?.recall_number}</div>
      </div>
      <div className="recall-extend">
              <div className="recall-header">Code Info:</div>
              <div>{recall?.code_info}</div>
                <div className="recall-header">Products Description:</div>
                <div>{recall?.product_description}</div>
                <div className="recall-header">Quantity:</div>
                <div>{recall?.product_quantity}</div>
            </div>
            <p className="foot-note">*Data retrieved from the fda website</p>
  </div>}</>
      }
    </>
  )
}

export default FdaRecall