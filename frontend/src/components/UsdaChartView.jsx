import { BarChart, Bar, Rectangle, Legend, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useMemo } from 'react'
import { useRecall } from '../RecallContext'
function UsdaChartView() {

    const [yearData, setYearData] = useState({ year1: "2010", year2: "2024" })

    const { fsis: recalls, errorFsis } = useRecall()

    const { year1, year2 } = yearData

    const returnData = (recalls, year1, year2) => {
        const data = []
        const newArray = []
        recalls.map(x => x.field_recall_reason).forEach(x => {
            if (x.includes(',')) {
                newArray.push(...x.split(','))
            } else {
                newArray.push(x)
            }
        })

        Array.from(new Set(newArray.map(x => x.trim())))
            .forEach(field => {
                const subData = { name: field === "" ? 'Unnamed' : field, recalls: 0 }
                recalls.filter(recall => recall.field_year >= year1 && recall.field_year <= year2)
                    .forEach(recall => {
                        recall.field_recall_reason.includes(field) && field !== "" && subData.recalls++
                        recall.field_recall_reason === "" && field.length === 0 && subData.recalls++
                    })
                data.push(subData)
            })
        return data
    }

    const returnYearData = () => {
        const data = []
        const sortRecall = (x, y) => {
            if (x > y) return 1
            if (x < y) return -1
        }
        Array.from(new Set(recalls.map(x => x.field_year)))
            .sort(sortRecall)
            .forEach(field => {
                const subData = { name: field, recalls: 0 }
                recalls.forEach(recall => recall.field_year === field && subData.recalls++)
                data.push(subData)
            })
        return data
    }

    const returnRiskData = (recalls, year1, year2) => {
        const data = []
        const sortRecall = (x, y) => {
            if (x > y) return 1
            if (x < y) return -1
        }
        Array.from(new Set(recalls.map(x => x.field_recall_classification)))
            .sort(sortRecall)
            .forEach(field => {
                const subData = { name: field, recalls: 0 }
                recalls
                    .filter(recall => recall.field_year >= year1 && recall.field_year <= year2)
                    .forEach(recall => recall.field_recall_classification === field && subData.recalls++)
                data.push(subData)
            })
        return data
    }

    const returnRecallType = (recalls, year1, year2) => {
        const data = []
        const sortRecall = (x, y) => {
            if (x > y) return 1
            if (x < y) return -1
        }
        Array.from(new Set(recalls.map(x => x.field_recall_type)))
            .sort(sortRecall)
            .forEach(field => {
                const subData = { name: field, recalls: 0 }
                recalls
                    .filter(recall => recall.field_year >= year1 && recall.field_year <= year2)
                    .forEach(recall => recall.field_recall_type === field && subData.recalls++)
                data.push(subData)
            })
        return data
    }

    const returnStateData = (recalls, year1, year2) => {
        const data = []
        const newArray = []
        recalls.map(x => x.field_states).filter(x => x !== "").forEach(x => {
            if (x.includes(',')) {
                newArray.push(...x.split(','))
            } else {
                newArray.push(x)
            }
        })
        Array.from(new Set(newArray.map(x => x.trim()))).sort((x, y) => {
            if (x > y) return 1
            return -1
        }).forEach(field => {
            const subData = { name: field, recalls: 0 }
            recalls
                .filter(recall => recall.field_year >= year1 && recall.field_year <= year2)
                .forEach(recall => recall.field_states.includes(field) && subData.recalls++)
            data.push(subData)
        })
        return data
    }

    const changeYear1 = (e) => {
        if (+e.target.value > +year2) {
            setYearData({
                year2: e.target.value, year1: year2
            })
        } else {
            setYearData(prevState => ({
                ...prevState, year1: e.target.value
            }))
        }
    }
    const changeYear2 = (e) => {
        if (+e.target.value < +year1) {
            setYearData(prevState => ({
                ...prevState, year2: year1, year1: e.target.value
            }))
        } else {
            setYearData(prevState => ({
                ...prevState, year2: e.target.value
            }))
        }
    }

    const data = useMemo(() => returnData(recalls, year1, year2), [recalls, year1, year2])
    const data1 = returnYearData()
    const data2 = useMemo(() => returnRiskData(recalls, year1, year2), [recalls, year1, year2])
    const data3 = useMemo(() => returnStateData(recalls, year1, year2), [recalls, year1, year2])
    const data4 = useMemo(() => returnRecallType(recalls, year1, year2), [recalls, year1, year2])

    return (
        <>
            {errorFsis === 'Network Error' && <div>Check your internet connection!</div>}
            {recalls.length === 0 && errorFsis === '' && <div className='spinner'></div>}
            {recalls.length > 0 && <>
                <div className="chart">
                    <div className='chart-heading'>Number of recalls per year since 2010</div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart width={500} height={400} data={data1}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="recalls" fill='black' activeBar={<Rectangle fill='gold' stroke='purple' />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className='jump'>
                    <label htmlFor="jump">Range of years:</label>
                    <select onChange={changeYear1} name="jump" id="jump1">{
                        Array.from(new Set(recalls.map(x => x.field_year))).sort((x, y) => {
                            if (x > y) return 1
                            return -1
                        }).map((year, idx) => (
                            <option selected={year === year1} key={idx} name={year} value={year}>{year}</option>
                        ))
                    }</select>
                    <label htmlFor="jump">to:</label>
                    <select onChange={changeYear2} name="jump" id="jump2">{
                        Array.from(new Set(recalls.map(x => x.field_year))).sort((x, y) => {
                            if (x > y) return -1
                            return 1
                        }).map((year, idx) => (
                            <option selected={year === year2} key={idx} name={year} value={year}>{year}</option>
                        ))
                    }</select>
                </div>
                <div className='chart'>
                    <div className='chart-heading'>Reasons for recalls and corresponding numbers</div>

                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart width={500} height={400} data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="recalls" fill='black' activeBar={<Rectangle fill='gold' stroke='purple' />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart">
                    <div className='chart-heading'>Risk levels for recalls and corresponding numbers</div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart width={500} height={400} data={data2}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="recalls" fill='black' activeBar={<Rectangle fill='gold' stroke='purple' />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart">
                    <div className='chart-heading'>Status of recalls and the corresponding numbers</div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart width={500} height={400} data={data4}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="recalls" fill='black' activeBar={<Rectangle fill='gold' stroke='purple' />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart">
                    <div className='chart-heading'>Number of recalls for each state</div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart width={500} height={400} data={data3}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="recalls" fill='black' activeBar={<Rectangle fill='gold' stroke='purple' />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </>}

            <p className="foot-note">*Data retrieved from the fsis website</p>
        </>
    )
}

export default UsdaChartView