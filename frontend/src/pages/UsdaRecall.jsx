import { useParams } from "react-router-dom";
import { useGetFsisRecallsQuery } from "../slices/recallApi";
import { useMemo } from "react";

function decodeHtmlEntities(text) {
  if (!text) return "";
  return text
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&rsquo;", "’")
    .replaceAll("&ldquo;", "“")
    .replaceAll("&rdquo;", "”");
}

function UsdaRecall() {
  const { usdaId } = useParams();
  const {
    data: recalls = [],
    isLoading,
    isError,
    refetch,
    error: errorFsis,
  } = useGetFsisRecallsQuery();

  // ✅ Cached and decoded recall
  const recall = useMemo(() => {
    const match = recalls.find(r => r.field_recall_number === usdaId);
    if (!match) return null;
    return {
      ...match,
      field_product_items: decodeHtmlEntities(match.field_product_items),
    };
  }, [recalls, usdaId]);

  return (
    <>
      {isLoading &&<p> Loading...</p>}

      {isError && (
        <div className="error-container">
          <p>Error: {errorFsis?.message || "Something went wrong."}</p>
          <button className="retry-button" onClick={refetch}>
            Reload
          </button>
        </div>
      )}

      {!isLoading && !isError && !recall && (
        <p>Recall not found!</p>
      )}

      {!!recall && (
        <div className="recall-list-1">
          <div className="recall-title">{recall.field_title}</div>

          {!!recall.field_establishment?.length && (
            <div className="company">
              <span>Company:</span>&nbsp;{recall.field_establishment}
            </div>
          )}

          <div className="recall-group">
            <div className="risk-level">
              <span>Risk:</span>&nbsp;{recall.field_recall_classification}
            </div>
            <div className="recall-cause">
              <span>Cause:</span>&nbsp;{recall.field_recall_reason}
            </div>
            <div className="recall-status">
              <span>Status:</span>&nbsp;{recall.field_recall_type}
            </div>
          </div>

          <div className="recall-details">
            <div className="recall-date">
              <span>Recall Date:</span>&nbsp;{recall.field_recall_date}
            </div>
            {!!recall.field_states?.length && (
              <div className="recall-states">
                <span>Distribution Area:</span>&nbsp;{recall.field_states}
              </div>
            )}
            <div>
              <span>Recall Number:</span>&nbsp;{recall.field_recall_number}
            </div>

            {recall.field_recall_type === "Closed Recall" && (
              <>
                <div>
                  <span>Recall Close Date:</span>&nbsp;{recall.field_closed_date}
                </div>
                <div>
                  <span>Quantity Recovered:</span>&nbsp;{recall.field_qty_recovered}
                </div>
              </>
            )}
          </div>

          <div className="recall-extend">
            <div className="recall-header">Company Media Contact:</div>
            <div>{recall.field_company_media_contact}</div>

            <div className="recall-header">Products Affected:</div>
            <div>{recall.field_product_items}</div>

            <div className="recall-header">Processing Type:</div>
            <div>{recall.field_processing}</div>
          </div>

          <p className="foot-note">*Data retrieved from the FSIS website</p>
        </div>
      )}
    </>
  );
}

export default UsdaRecall;
