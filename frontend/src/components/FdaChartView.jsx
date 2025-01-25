import { BarChart, Bar, Rectangle, Legend, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import states from '../states/states.json'
import { useState, useMemo } from 'react'
import { useRecall } from '../RecallContext'

function FdaChartView() {
    const [yearData, setYearData] = useState({ year1: "2015", year2: "2024" })

    const { fda: recalls, errorFda } = useRecall()

    const { year1, year2 } = yearData

    const returnYearData = () => {
        const data = []
        Array.from(new Set(recalls.map(x => x.report_date.substring(0, 4))))
            .sort((x, y) => {
                if (x > y) return 1
                return -1
            }
            )
            .forEach(field => {
                const subData = { name: field, recalls: 0 }
                recalls
                    .forEach(recall => recall.report_date.substring(0, 4) === field && subData.recalls++)
                data.push(subData)
            })
        return data
    }
    const returnRiskData = (recalls, year1, year2) => {
        const data = []
        Array.from(new Set(recalls.map(x => x.classification)))
            .sort((x, y) => {
                if (x > y) return 1
                return -1
            }
            )
            .forEach(field => {
                const subData = { name: field, recalls: 0 }
                recalls
                    .filter(recall => recall.report_date.substring(0, 4) >= year1 && recall.report_date.substring(0, 4) <= year2)
                    .forEach(recall => recall.classification === field && subData.recalls++)
                data.push(subData)
            })
        return data
    }

    const returnRecallType = (recalls, year1, year2) => {
        const data = []
        Array.from(new Set(recalls.map(x => x.status)))
            .sort((x, y) => {
                if (x > y) return 1
                return -1
            }
            )
            .forEach(field => {
                const subData = { name: field, recalls: 0 }
                recalls
                    .filter(recall => recall.report_date.substring(0, 4) >= year1 && recall.report_date.substring(0, 4) <= year2)
                    .forEach(recall => recall.status === field && subData.recalls++)
                data.push(subData)
            })
        return data
    }

    const returnStateData = (recalls, year1, year2) => {
        const data = []
        Object.keys(states)
            .sort((x, y) => {
                if (x > y) return 1
                return -1
            }).forEach(field => {
                const subData = { name: field, recalls: 0 }
                recalls
                    .filter(recall => recall.report_date.substring(0, 4) >= year1 && recall.report_date.substring(0, 4) <= year2)
                    .forEach(x => (x.distribution_pattern.toLowerCase().includes(field.toLowerCase()) || x.distribution_pattern.includes(states[field])) && subData.recalls++)
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

    const data1 = returnYearData()
    const data2 = useMemo(() => returnRiskData(recalls, year1, year2), [recalls, year1, year2])
    const data4 = useMemo(() => returnRecallType(recalls, year1, year2), [recalls, year1, year2])
    const data3 = useMemo(() => returnStateData(recalls, year1, year2), [recalls, year1, year2])
    const minWidth = 300
    const width1 = data1.length * 100 < minWidth ? minWidth : data1.length * 100
    const width2 = data2.length * 100 < minWidth ? minWidth : data2.length * 100
    const width3 = data3.length * 100 < minWidth ? minWidth : data3.length * 100
    const width4 = data4.length * 100 < minWidth ? minWidth : data4.length * 100
    return (
        <>
            {errorFda === 'Network Error' ? <div>Check your internet connection!</div> :
            <div>
                {recalls.length === 0 && errorFda === '' && <div className='spinner'></div>}
            {recalls.length > 0 && <>
                <div className="chart">
                    <div className='chart-heading'>Number of recalls per year since 2015</div>
                    {/*<ResponsiveContainer width="100%" height="100%">*/}
                    <div className="graph-wrapper"
                        onScroll={(e) => {
                            let axis = document.querySelector(".recharts-yAxis");
                            axis.style = "transform: translateX(" + e.target.scrollLeft + "px);";
                            //For Left Orientation
                        }}> 
                        <BarChart width={width1} height={300} data={data1}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="recalls" fill='black' activeBar={<Rectangle fill='gold' stroke='purple' />} />
                        </BarChart>
                    </div>
                    {/*</ResponsiveContainer>*/}
                </div>
                <div className='jump'>
                    <label htmlFor="jump">Range of years:</label>
                    <select onChange={changeYear1} name="jump" id="jump1">{
                        Array.from(new Set(recalls.map(x => x.report_date.substring(0, 4)))).sort((x, y) => {
                            if (x > y) return 1
                            return -1
                        }).map((year, idx) => (
                            <option selected={year === year1} key={idx} name={year} value={year}>{year}</option>
                        ))
                    }</select>
                    <label htmlFor="jump">to:</label>
                    <select onChange={changeYear2} name="jump" id="jump2">{
                        Array.from(new Set(recalls.map(x => x.report_date.substring(0, 4)))).sort((x, y) => {
                            if (x > y) return -1
                            return 1
                        }).map((year, idx) => (
                            <option selected={year === year2} key={idx} name={year} value={year}>{year}</option>
                        ))
                    }</select>
                </div>
                <div className='chart-ab'>
                <div className="chart">
                    <div className='chart-heading'>Risk levels for recalls and corresponding numbers</div>
                    {/*<ResponsiveContainer width="100%" height="100%">*/}
                    <div className="graph-wrapper"
                        onScroll={(e) => {
                            let axis = document.querySelector(".recharts-yAxis");
                            axis.style = "transform: translateX(" + e.target.scrollLeft + "px);";
                            //For Left Orientation
                        }}>
                        <BarChart width={width2} height={300} data={data2}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="recalls" fill='black' activeBar={<Rectangle fill='gold' stroke='purple' />} />
                        </BarChart>
                    </div>
                    {/*</ResponsiveContainer>*/}
                </div>

                <div className="chart">
                    <div className='chart-heading'>Status of recalls and the corresponding numbers</div>
                    {/*<ResponsiveContainer width="100%" height="100%">*/}
                    <div className="graph-wrapper"
                        onScroll={(e) => {
                            let axis = document.querySelector(".recharts-yAxis");
                            axis.style = "transform: translateX(" + e.target.scrollLeft + "px);";
                            //For Left Orientation
                        }}>
                        <BarChart width={width4} height={300} data={data4}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="recalls" fill='black' activeBar={<Rectangle fill='gold' stroke='purple' />} />
                        </BarChart>
                    </div>
                    {/*</ResponsiveContainer>*/}
                </div>
                </div>

                <div className="chart">
                    <div className='chart-heading'>Number of recalls for each state</div>
                    {/*<ResponsiveContainer width="100%" height="100%">*/}
                    <div className="graph-wrapper"
                        onScroll={(e) => {
                            let axis = document.querySelector(".recharts-yAxis");
                            axis.style = "transform: translateX(" + e.target.scrollLeft + "px);";
                            //For Left Orientation
                        }}>
                        <BarChart width={width3} height={300} data={data3}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="recalls" fill='black' activeBar={<Rectangle fill='gold' stroke='purple' />} />
                        </BarChart>
                    </div>
                    {/*</ResponsiveContainer>*/}
                </div>
            </>}
            <p className="foot-note">*Data retrieved from the fda website</p></div>}
            
        </>
    )
}

export default FdaChartView