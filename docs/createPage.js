const createPage = () => {

  console.log('sono connesso e aggiornato')

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
        if(d.observable_link!=''){
          console.log('here the code', d.observable_link)
          d3.select('#buttons-row')
            .append('div')
              .attr('class','col')
            .append('a')
              .attr('role','button')
              .attr('class','btn btn-outline-primary')
              .attr('href',d.observable_link)
              .attr('target','_blank')
              .html(function(){
                if (d.observable_name!== ''){
                  return '<i class="far fa-bookmark fa-2x"></i><br><span>'+d.observable_name+'</span>';
                } else if (d.observable_name!== 'null'){
                  return '<i class="far fa-bookmark fa-2x"></i>';
                } else {
                  return '<i class="far fa-bookmark fa-2x"></i><br><span>Observable<br>Notebook</span>';
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

