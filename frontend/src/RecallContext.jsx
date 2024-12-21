import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
export const RecallContext = createContext({
  fda: [],
  fsis: [],
  errorFsis: '',
  errorFda: '',
  returnFda: () => {},
  fetchUsda: () => {}
});

function RecallProvider({ children }) {
  const [fda, setFda] = useState([]);
  const [fsis, setFsis] = useState([]);
  const [ errorFsis, setErrorFsis] = useState('')
  const [ errorFda, setErrorFda ] = useState('')

  useEffect(() => {
/*
    const createFda = (fdas) => {
      const newFda = []
      fdas.map(fda => newFda.push(...fda.results))
      setFda(newFda)
    }
    async function makeAPICall(endpoint) {
      const response = await axios.get(endpoint);
      const data = await response.data;
      return data;
    }
  
    async function makeMultipleAPICalls(endpoints) {
      const promises = endpoints.map(makeAPICall);
      const responses = await Promise.all(promises);
      createFda(responses)
      console.log(responses)
      return responses;
    }
    (async () => {
      try {
      await makeMultipleAPICalls([
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20240101+TO+20241231]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20230801+TO+20231231]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20230401+TO+20230731]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20230101+TO+20230331]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20220601+TO+20221231]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20220101+TO+20220531]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20210501+TO+20211231]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20200701+TO+20210430]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20191001+TO+20200630]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20190501+TO+20190930]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20181101+TO+20190430]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20180501+TO+20181031]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20171201+TO+20180430]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20170801+TO+20171130]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20170501+TO+20170731]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20170201+TO+20170430]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20161201+TO+20170131]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20161001+TO+20161130]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20160601+TO+20160930]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20160101+TO+20160531]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20150801+TO+20151231]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20150501+TO+20150731]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20150331+TO+20150430]&limit=1000",
        "https://api.fda.gov/food/enforcement.json?api_key=UfWlZLSEWUUJqeY3s0Qagdt7u5vsDThx1Jb4zKSA&search=report_date:[20150101+TO+20150330]&limit=1000"
        
      ]);
        
      } catch (error) {
        setErrorFda(error.message)
        console.log(error.message)
      }
    })()*/
    
      fetchFda()
      fetchUsda()
    
  }, []);
  const fetchFda = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: "https://foodrecallapi.vercel.app/api/getFda",
      headers: {}
    };
    try {
      const response = await axios.request(config)
      const data = await response.data
      setFda(data)
    } catch (error) {
      setErrorFda(error.message)
      console.log(error.message)
    }
  }
   const fetchUsda = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: "https://www.fsis.usda.gov/fsis/api/recall/v/1",
      headers: {}
    };
    
    try {
      const response = await axios.request(config)
      const data = await response.data
      const newData =  data
        .map(x => x.field_title.includes('&#039;') ? 
        {...x, field_title:x['field_title'].replaceAll('&#039;', "'")} : x)
        .map(x => x.field_title.includes('&amp;') ? 
        {...x, field_title:x['field_title'].replaceAll('&amp;', "&")} : x)
        .map(x => x.field_title.includes('&quot;') ? 
        {...x, field_title:x['field_title'].replaceAll('&quot;', '"')} : x)
        .map(x => x.field_title.includes('&rsquo;') ? 
        {...x, field_title:x['field_title'].replaceAll('&rsquo;', "’")} : x)
        .map(x => x.field_title.includes('&ldquo;') ? 
        {...x, field_title:x['field_title'].replaceAll('&ldquo;', '“')} : x)
        .map(x => x.field_title.includes('&rdquo;') ? 
        {...x, field_title:x['field_title'].replaceAll('&rdquo;', '”')} : x)
        .map(x => x.field_establishment.includes('&#039;') ? 
        {...x, field_establishment:x['field_title'].replaceAll('&#039;', "'")} : x)
        .map(x => x.field_establishment.includes('&amp;') ? 
        {...x, field_establishment:x['field_title'].replaceAll('&amp;', "&")} : x)
        .map(x => x.field_establishment.includes('quot;') ? 
        {...x, field_establishment:x['field_title'].replaceAll('quot;', '"')} : x)
        .map(x => x.field_establishment.includes('&rsquo;') ? 
        {...x, field_establishment:x['field_title'].replaceAll('&rsquo;', "’")} : x)
        .map(x => x.field_establishment.includes('&ldquo;') ? 
        {...x, field_establishment:x['field_title'].replaceAll('&ldquo;', '“')} : x)
        .map(x => x.field_establishment.includes('&rdquo;') ? 
        {...x, field_establishment:x['field_title'].replaceAll('&rdquo;', '”')} : x)
      setFsis(newData)
    } catch (error) {
      setErrorFsis(error.message)
      console.log(error.message)
    }
  }

  const contextValue = {
    fda: fda,
    fsis: fsis,
    errorFsis: errorFsis,
    errorFda: errorFda,
    fetchUsda
  };

  return (
    <RecallContext.Provider value={contextValue}>
      {children}
    </RecallContext.Provider>
  );
}

export default RecallProvider;

export const useRecall = () => {
  return useContext(RecallContext);
};
