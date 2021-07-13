const createPage = () => {

  console.log('sono connesso')

  d3.tsv('./information-paper.tsv').then(function(data) {
    data.forEach(function (d) {
      console.log(d)
      $('meta[property="og:title"]').remove();
      $('head').append( '<meta property="og:title" content="'+d.title+'">')

      
      if (d.title!== ''){
        d3.select('#title').html(d.title)
      }
      if (d.authors!== ''){
        d3.select('#authors').html(d.authors)
      }

      if (d.venue!== ''){
        console.log(d.venue)
        d3.select('#venue').html(d.venue)
      }

      if (d.doi!== ''){
        d3.select('#doi').append('a')
        .attr('href','https://doi.org/'+d.doi)
        .attr('target','_blank')
        .html('DOI: '+d.doi)
      }

      if (d.researchGate!== ''){
        d3.select('#researchGate').append('a')
        .attr('href',d.researchGate)
        .attr('target','_blank')
        .html('View Paper on Research Gate')
      }

      
      if (d.img!== '' && d.key!= ''){
        console.log(d.image,d.key)
        d3.select('#teaser').attr('src','./img/'+d.img+d.key)
      }

      if(d.github_link!=''){
        d3.select('#buttons-row')
          .append('div')
            .attr('class','col')
          .append('a')
            .attr('role','button')
            .attr('class','btn btn-outline-primary')
            .attr('href',d.github_link)
            .attr('target','_blank')
            .html(function(){
              if (d.github_name!== ''){
                return '<i class="fab fa-github fa-2x"></i><br><span>'+d.github_name+'</span>';
              } else if (d.github_name!== 'null'){
                return '<i class="fab fa-github fa-2x"></i>';
              }  else {
                return '<i class="fab fa-github fa-2x"></i><br><span>GitHub<br>Repository</span>';
              }
            })
            //<a id="github-fork" href="https://github.com/aware-diag-sapienza/crosswidget" target="_blank">
            //<img width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_left_darkblue_121621.png?resize=149%2C149" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1"></a>
   
          d3.select('#github-fork')
            .attr('href',d.github_link)
            .attr('target','_blank')
            .append('img')
            .attr('width',149)
            .attr('height',149)
            .attr('src','https://github.blog/wp-content/uploads/2008/12/forkme_left_darkblue_121621.png?resize=149%2C149')
            .attr('class','attachment-full size-full')
            .attr('alt','Fork me on GitHub') 
            .attr('data-recalc-dims',1)
        }
      
        
      if(d.prototype_link!=''){
        d3.select('#buttons-row')
          .append('div')
            .attr('class','col')
          .append('a')
            .attr('role','button')
            .attr('class','btn btn-outline-primary')
            .attr('href',d.prototype_link)
            .attr('target','_blank')
            .html(function(){
              if (d.prototype_name!== ''){
                return '<i class="far fa-window-restore fa-2x"></i><br><span>'+d.prototype_name+'</span>';
              } else if (d.prototype_name!== 'null'){
                return '<i class="far fa-window-restore fa-2x"></i>';
              } else {
                return '<i class="far fa-window-restore fa-2x"></i><br><span>Validation<br>Prototype</span>';
              }
            })
        }
      if(d.additional_link!=''){
        d3.select('#buttons-row')
          .append('div')
            .attr('class','col')
          .append('a')
            .attr('role','button')
            .attr('class','btn btn-outline-primary')
            .attr('href',d.additional_link)
            .attr('target','_blank')
            .html(function(){
              if (d.additional_name!== ''){
                return d.additional_icon + '<br><span>'+d.additional_name+'</span>';
              } else if (d.additional_name!== 'null'){
                return d.additional_icon;
              }
               else {
                return d.additional_icon+'<br><span>Additional<br>Button</span>';
              }
            })
          }
      
      if(d.video_link!=''){
        d3.select('#buttons-row')
          .append('div')
            .attr('class','col')
          .append('a')
            .attr('role','button')
            .attr('class','btn btn-outline-primary')
            .attr('href',d.video_link)
            .attr('target','_blank')
            .html(function(){
              if (d.video_name!== ''){
                return '<i class="fas fa-video fa-2x"></i><br><span>'+d.video_name+'</span>';
              } else {
                return '<i class="fas fa-video fa-2x"></i><br><span>Demonstrative<br>Video</span>';
              }
            })
        }

        //'label-abstract'
      if(d.abstract !== ''){
        d3.select('#label-abstract').html('<b>Abstract</b>')

        d3.select('#abstract-content').html(d.abstract)
      }
    })
  })
}
  /*
  const pubs = d3.select('.pubs-list')
  const years = []
  let tab = undefined
  d3.tsv('./publications/aware-pubs.tsv', function (error, data) {
      if (error) throw error
      data.forEach(function (d) {
          if (years.indexOf(d.year) < 0) {
              pubs.append('h2')
                  .attr('class', 'ui centered header')
                  .html(d.year)
              pubs.append('div')
                  .attr('class', 'ui divider')
              tab = pubs.append('div')
                  .attr('class', 'ui relaxed divided items')
              years.push(d.year)
          }
          addEntry(d, tab)
      })
      pubs.append('h2')
          .attr('class', 'ui centered header')
          .html('< 2013')
      pubs.append('div')
          .attr('class', 'ui divider')
      pubs.append('div')
          .attr('class', 'ui large center aligned header')
          .html('Work in Progress...')
      pubs.append('p')
          .attr('class', 'ui justified container pubs-old')
          .style('font-size', '1em')
          .html('<ul>\n' +
              '      <li>\n' +
              '      Da Silva, I.C.S., Dal Sasso Freitas, C.M., Santucci, G.<br>\n' +
              '      An integrated approach for evaluating the visualization of intensional and extensional levels of ontologies<br>\n' +
              '      (2012) ACM International Conference Proceeding Series<br>\n' +
              '      https://www.scopus.com/inward/record.uri?eid=2-s2.0-84874882912&amp;doi=10.1145%2f2442576.2442578&amp;partnerID=40&amp;md5=14e45623c01fdcfa76b8d7e9854618d6\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      Angelini, M., Ferro, N., Granato, G., Santucci, G., Silvello, G.<br>\n' +
              '      Information retrieval failure analysis: Visual analytics as a support for interactive "what-if" investigation<br>\n' +
              '      (2012) IEEE Conference on Visual Analytics Science and Technology 2012, VAST 2012 - Proceedings<br>\n' +
              '      https://www.scopus.com/inward/record.uri?eid=2-s2.0-84872973954&amp;doi=10.1109%2fVAST.2012.6400551&amp;partnerID=40&amp;md5=5744711bdf3216f56a550a4212d9b86d\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      Angelini, M., Ferro, N., Järvelin, K., Keskustalo, H., Pirkola, A., Santucci, G., Silvello, G.<br>\n' +
              '      Cumulated relative position: A metric for ranking evaluation<br>\n' +
              '      (2012) Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)<br>\n' +
              '      https://www.scopus.com/inward/record.uri?eid=2-s2.0-84867650788&amp;doi=10.1007%2f978-3-642-33247-0_13&amp;partnerID=40&amp;md5=acae6266c4c742f393093d07d8f7ba59\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      M. Angelini, N. Ferro, G. Santucci, G. Silvello<br>\n' +
              '      Visual Interactive Failure Analysis: Supporting Users in Information Retrieval Evaluation<br>\n' +
              '      IIIX\'12 Information Interaction in Context Symposium conference, <i>August</i> 2012, Nijmegen, the Netherlands.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      M. Angelini, M. de Rijke, G. Granato, D. Odijk, G. Santucci<br>\n' +
              '      Time-Aware Exploratory Search: Exploring Word Meaning through Time<br>\n' +
              '      SIGIR 2012 workshop on Time-aware Information Access, <i>August</i> 2012, Portland, USA.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E.Bertini, C. Plaisant, G.Santucci<br>\n' +
              '      BELIV \'06: Beyond Time and Errors; Novel Evaluation Methods for Information Visualization<br>\n' +
              '      ACM interactions magazine May+June 2007.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E.Bertini, A. Di Girolamo, G.Santucci<br>\n' +
              '      See what you know: analyzing data distribution to improve density map visualization<br>\n' +
              '      International Eurovis 2007 conference, <i>May</i> 2007, Norrkoping, Sweden.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E.Bertini, G.Santucci<br>\n' +
              '      Give chance a chance: modeling density to enhance scatter plot quality through random data sampling<br>\n' +
              '      Information Visualization, (2006), 95-110, 2006.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, G.Santucci<br>\n' +
              '      Visual Quality Metrics - Proceedings del International Workshop BELIV\'06 BEyond time and errors: novel evaLuation methods for Information Visualization<br>\n' +
              '      International workshop of the AVI 2006 International Working Conference, Venezia, Italy, 23 May 2006. Published on ACM digital libraries.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, L. Dell\'Aquila, G.Santucci<br>\n' +
              '      Reducing InfoVis cluttering through non uniform sampling, displacement, and user perception<br>\n' +
              '      Proceedings della International Conference on Visualization and Data Analysis 2006, part of the IS&amp;T/SPIE Symposium on Electronic Imaging 2006, January 2006 in San Jose, CA USA\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, G.Santucci<br>\n' +
              '      Reducing Infovis cluttering through sampling displacement and user perception<br>\n' +
              '      Poster nei Proceedings del IEEE Symposium on Information Visualisation Infovis05, 23-25 ottobre, Minneapolis, Minnesota, USA.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, L. Dell\'Aquila, G.Santucci<br>\n' +
              '      Discovering USA companies insights using DARE and SpringView<br>\n' +
              '      Honorable mention of the Infovis contest 2005, Proceedings del IEEE Symposium on Information Visualisation Infovis05, 23-25 ottobre, Minneapolis, Minnesota, USA.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, L. Dell\'Aquila, G.Santucci<br>\n' +
              '      SpringView: Cooperation of Radviz and Parallel Coordinates for View Optimization and Clutter Reduction<br>\n' +
              '      Proceedings of the Third IEEE International Conference on Coordinated &amp; Multiple Views in Exploratory Visualization (CMV 2005) July 2005, London.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, G.Santucci<br>\n' +
              '      Improving 2D scatterplots effectiveness through sampling, displacement, and user Perception<br>\n' +
              '      Proceedings of the 9th International Conference on Information Visualisation IV05 - July 2005, London.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, G.Santucci<br>\n' +
              '      Is it darker? Improving density representation in 2D scatter plots through a user study<br>\n' +
              '      Proceedings della International Conference on Visualization and Data Analysis 2005, part of the IS&amp;T/SPIE Symposium on Electronic Imaging 2005, 16-20 January 2005 in San Jose, CA USA\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, G.Santucci<br>\n' +
              '      By chance is not enough: preserving relative density through non uniform sampling<br>\n' +
              '      Proceedings della 8th International Conference on Information Visualisation IV04 -July 2004, London.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, T. Catarci, S. Kimani, G. Santucci<br>\n' +
              '      Exploiting Multiple Views Toward Supporting the Entire Visual Exploration and Mining Process<br>\n' +
              '      Proceedings della Second IEEE International Conference on Coordinated &amp; Multiple Views in Exploratory Visualization (CMV 2004) July 2004, London.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, G.Santucci<br>\n' +
              '      Modelling internet based applications for designing multi-device adaptive interfaces<br>\n' +
              '      Proceedings della conferenza internazionale on Advanced Visual Interfaces (AVI 2004), Gallipoli, giugno 2004.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, G.Santucci<br>\n' +
              '      Quality metrics for 2D scatterplot graphics: automatically reducing visual clutter<br>\n' +
              '      Proceedings del 4th International Symposium on SmartGraphics, May 22-24 2004, Banff Centre, Canada.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      S.Kimani, T.Catarci, G. Santucci<br>\n' +
              '      Visual data mining: An experience with the users<br>\n' +
              '      Proceedings della 2nd International Conference on Universal Access in Human-Computer Interaction; (UAHCI 2003), Crete, Greece, 22-27 June 2003.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      S.Kimani, T.Catarci, G.Santucci<br>\n' +
              '      A Visual Data Mining Environment: Metaqueries and Association Rules<br>\n' +
              '      Proceedings della conferenza internazionale on Advanced Visual Interfaces (AVI 2002), Trento, Maggio 2002.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      S.Kimani, T.Catarci, G.Santucci<br>\n' +
              '      A Visual Data Mining Environment<br>\n' +
              '      Proceedings del Second International Workshop on Visual Data Mining, Agosto 2002, Elsinki, Finlandia.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      S.Kimani, T.Catarci, G.Santucci<br>\n' +
              '      A Visual Data Mining System<br>\n' +
              '      Proceedings del Codata Workshop on Information Visualization, Presentation, &amp; Design, Luglio 2002, Parigi.\n' +
              '      </li>\n' +
              '      <li>\n' +
              '      E. Bertini, G.Santucci<br>\n' +
              '      Data Mining and InformationVisualization: a result+data approach<br>\n' +
              '      DIMACS Workshop on Visualization and Data Mining, New Jersey, ottobre 2002.\n' +
              '      </li>\n' +
              '    </ul>')
      $('.ui.accordion')
          .accordion()
  })
}

const addEntry = (d, tab) => {
  const item = tab
      .append('div')
      .attr('class', 'item')
  item.append('div')
      .attr('class', 'image')
      .append('img')
      .attr('src', () => {
          if (d.img !== '') return './img/publications/' + d.key + '.' + d.img
          return './img/blank.png'
      })
  const content = item.append('div')
      .attr('class', 'content')
  content.append('div')
      .attr('class', 'header')
      .html(d.title)
  content.append('div')
      .attr('class', 'meta')
      .append('span')
      .html(() => {
          if (d.authors === '') return 'Editors: ' + d.editors
          return d.authors
  })
  const description = content.append('div')
      .attr('class', 'description')
  description.append('div')
      .html(() => {
          let venue = d.venue
          if (d.volume !== '') venue = venue.concat(', Volume ', d.volume)
          if (d.issue !== '') venue = venue.concat(', Issue ', d.issue)
          return venue
      })
  if (d.abstract !== '') {
      const abs = description.append('div')
          .attr('class', 'ui fluid accordion')
      const title = abs.append('div')
          .attr('class', 'title')
      title.append('i')
          .attr('class', 'dropdown icon')
      title.append('span')
          .html('Abstract')
      abs.append('div')
          .attr('class', 'content')
          .append('p')
          .attr('class', 'transition hidden ui justified container')
          .style('font-size', '1em')
          .html(d.abstract)
  }
  if (d.keywords !== '') {
      content.append('div')
          .attr('class', 'extra')
          .html(d.keywords)
  }
  if (d.doi !== '') {
      const doi = content.append('div')
          .attr('class', 'extra')
      doi.append('i')
          .attr('class', 'ai ai-doi')
      doi.append('a')
          .attr('target', '_blank')
          .attr('href', 'https://doi.org/' + d.doi)
          .html(d.doi)
  }
  if (d.url !== '') {
      const url = content.append('div')
          .attr('class', 'extra')
      url.append('i')
          .attr('class', 'linkify icon')
      url.append('a')
          .attr('target', '_blank')
          .attr('href', d.url)
          .html(d.url.substring(nth_occurrence(d.url, '/', 2) + 1, d.url.length))
  }
  if (d.pdf !== '') {
      const pdf = content.append('div')
          .attr('class', 'extra')
      pdf.append('i')
          .attr('class', 'file pdf outline icon')
      pdf.append('a')
          .attr('target', '_blank')
          .attr('href', d.pdf)
          .html(d.namepdf+ '.pdf')
          //.html(d.pdf.substring(nth_occurrence(d.pdf, '/', 2) + 1, d.pdf.length))
  }*/


const nth_occurrence = (string, char, nth) => {
  const first_index = string.indexOf(char)
  const length_up_to_first_index = first_index + 1
  if (nth === 1) return first_index
  else {
      const string_after_first_occurrence = string.slice(length_up_to_first_index)
      const next_occurrence = nth_occurrence(string_after_first_occurrence, char, nth - 1)
      if (next_occurrence === -1) return -1
      else return length_up_to_first_index + next_occurrence
  }
}

