import md5 from "md5";
import axios from "axios"
import jsonpAdapter from "axios-jsonp"

import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import {
  ErrorBoundary,
  Paging,
  PagingInfo,
  Results,
  ResultsPerPage,
  SearchBox,
  SearchProvider,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import {Layout,} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

const SORT_OPTIONS = [
  {
    name: "相关性",
    value: []
  },
  {
    name: "专辑ID",
    value: [
      {
        field: "album_id",
        direction: "asc"
      }
    ]
  }
];


const connector = new AppSearchAPIConnector({
  searchKey: "search-61uqziq4qihhtif9oue65oni",
  engineName: "albums",
  endpointBase: "http://192.168.0.195:3002",
  cacheResponses: false
});

const config = {
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    result_fields: {
      album_id: {raw: {}},
      //category_name: {raw: {}},
      label_name: {raw: {}},
      album_url: {raw: {}},
      album_cover: {raw: {}},
      album_cname: {
        snippet: {
          size: 100,
          fallback: true
        }
      },
      composer_cname: {
        snippet: {
          size: 100,
          fallback: true
        }
      },
      artist_cname: {
        snippet: {
          size: 100,
          fallback: true
        }
      }
    }
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      result_fields: {
        album_cname: {
          snippet: {
            size: 100,
            fallback: true
          }
        },
        album_url: {raw: {}}
      }
    },
    suggestions: {
      types: {
        documents: {
          fields: ["album_cname", 'composer_name', 'composer_cname']
        }
      },
      size: 3
    }
  }
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({wasSearched, setSearchTerm}) => ({wasSearched, setSearchTerm})}>
        {({wasSearched, setSearchTerm}) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={
                    <SearchBox
                      autocompleteMinimumCharacters={3}
                      //searchAsYouType={true}
                      autocompleteResults={{
                        //linkTarget: "_blank",
                        sectionTitle: "专辑",
                        titleField: "album_cname",
                        urlField: "album_url",
                        shouldTrackClickThrough: true,
                        clickThroughTags: ["auto"]
                      }}
                      autocompleteSuggestions={true}
                      debounceLength={0}
                      onSubmit={(searchTerm) => {
                        //Translation with baidu，This is for test purpose only.
                        //It should be done on server side to protect APPID+Secret in production.
                        const appid = '20220407001162139';
                        const key = 'uV1MjGFfe2Tlr2vttfKF';
                        const salt = (new Date()).getTime();
                        const query = searchTerm;
                        // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
                        const from = 'auto';
                        const to = 'en';
                        const str1 = appid + query + salt + key;
                        const sign = md5(str1);

                        setSearchTerm(searchTerm, { shouldClearFilters:true});
                        /*
                        axios.get('https://fanyi-api.baidu.com/api/trans/vip/translate',
                          {
                            params: {
                              q: query,
                              appid: appid,
                              salt: salt,
                              from: from,
                              to: to,
                              sign: sign
                            },
                            adapter: jsonpAdapter
                          })
                          .then((res) => {
                            let finalSearchTerm = searchTerm;
                            res.data.trans_result.forEach((r) => {
                              finalSearchTerm += " " + r.dst;
                            });
                            setSearchTerm(finalSearchTerm, {shouldClearFilters: true});
                          })
                          .catch((error) => {
                            setSearchTerm(searchTerm, {shouldClearFilters: true});
                          });
                          */
                        //navigate("/search?q=" + searchTerm);
                      }}
                    />
                  }
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting label={"Sort by"} sortOptions={SORT_OPTIONS}/>
                      )}
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField="album_id"
                      urlField="album_url"
                      thumbnailField="album_cover"
                      shouldTrackClickThrough={true}
                      clickThroughTags= {["body"]}
                    />
                  }
                  bodyHeader={
                    <>
                      {wasSearched && <PagingInfo/>}
                      {wasSearched && <ResultsPerPage/>}
                    </>
                  }
                  bodyFooter={<Paging/>}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
