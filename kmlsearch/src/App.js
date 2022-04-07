import moment from "moment";

import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import {
  BooleanFacet,
  Layout,
  SingleSelectFacet,
  SingleLinksFacet
} from "@elastic/react-search-ui-views";
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
      album_id: { raw: {} },
      category_name: { raw: {} },
      label_name: { raw: {} },
      album_url: { raw: {} },
      album_cover: {raw: {} },
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
        album_url: {raw:{}}
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
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
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
                        clickThroughTags: ["test"]
                      }}
                      autocompleteSuggestions={true}
                      debounceLength={0}
                    />
                  }
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting label={"Sort by"} sortOptions={SORT_OPTIONS} />
                      )}
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField="album_id"
                      urlField="album_url"
                      thumbnailField="album_cover"
                      shouldTrackClickThrough={true}
                    />
                  }
                  bodyHeader={
                    <>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
