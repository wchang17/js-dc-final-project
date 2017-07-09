  let request = new XMLHttpRequest()
  request.onreadystatechange = handleRequest

 request.open('GET', 'https://newsapi.org/v1/sources?language=en')
 request.send()
 
   function handleRequest() {
    if ( request.readyState === 4 ) {
      let response = JSON.parse( request.response )

      console.log(response)
    }
  }

  // https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=2f94009c02d6422eae47c2195597f437