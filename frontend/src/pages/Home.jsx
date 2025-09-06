import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetFsisRecallsQuery } from '../slices/recallApi';

function Home() {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useGetFsisRecallsQuery();

  const filteredRecalls = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data]
      .sort((a, b) => new Date(b.field_recall_date) - new Date(a.field_recall_date))
      .slice(0, 3);
  }, [data]);

  return (
    <>
      {/* Always visible */}
      <div className="home-image">
        <h1 className="home-image-heading">Food Recall Tool</h1>
        <span className="home-image-sub">Keep up to date with all food recalls</span>
      </div>

      {/* Conditional rendering */}
      {isLoading && <p>Loading...</p>}

      {isError && (
        <div className="error-container">
          <p>Error: {error?.message || 'Something went wrong.'}</p>
          <button className="retry-button" onClick={refetch}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {filteredRecalls.length > 0 ? (
            <div className="latest-recalls">
              {filteredRecalls.map((recall) => (
                <Link
                  data-testid="recall"
                  to={`/recalls/usda/${recall.field_recall_number}`}
                  key={recall.field_recall_number}
                  className="recall-list"
                >
                  <div className="home-field-title">{recall.field_title}</div>
                  <div className="recall-date">
                    <span>Date:</span>&nbsp;{recall.field_recall_date}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No recent recalls found.</p>
          )}
        </>
      )}
    </>
  );
}

export default Home;
