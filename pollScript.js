// Function to dynamically load a CSS file
const loadCSS = (cssUrl) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  link.type = 'text/css';
  document.head.appendChild(link);
};

const loadGoogleFont = () => {
  const link1 = document.createElement('link');
  link1.rel = "preconnect"
  link1.href="https://fonts.googleapis.com"
  const link2 = document.createElement('link');
  link2.rel = "preconnect"
  link2.href="https://fonts.gstatic.com"
  link2.crossOrigin

  const link = document.createElement('link');
  link.rel ='stylesheet';
  link.href = "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap";
  document.head.appendChild(link1);
  document.head.appendChild(link2);
  document.head.appendChild(link);
}

// Load the CSS file
loadGoogleFont()
loadCSS('https://shefaligoyal17.github.io/poll-script/poll-style.css'); // Replace with your hosted CSS file URL


window.PollNamespace = window.PollNamespace || {};

  window.PollNamespace.GetPollBanner = (id, targetSelector = '#my-custom-container') => {
    const fetchApi = async (id) => {
      try {
        const res = await fetch(`https://post-summary.yukta.one/get_poll/${id}`);
        const data = await res.json();
        if (data?.question) {
          return data;
        } else if (data?.detail) {
          return data.detail;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
    };

      const fetchAdApi = async (type) => {
      try {
        const res = await fetch(`https://post-summary.yukta.one/api/ad?type=${type}`);
        const data = await res.json();
        if (data?.ad_html) {
          return data.ad_html;
        }
      } catch (error) {
        console.error('Error fetching ad data:', error);
        return null;
      }
    }

    const PostUserResponse = async (pollId, ques, userAnswer) => {
      try {
        if (!pollId || !ques || !userAnswer) {
          return null;
        }
        const res = await fetch(`https://post-summary.yukta.one/submit_poll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ poll_id: pollId, question: ques, user_answer: userAnswer }),
        });
        const data = await res.json();
        if (data?.success) {
          return true
        } else {
          return false
        }
      } catch (error) {
        console.error('Error posting data:', error);
        return null;
      }
    }

    const renderAdContent = async () => {
      const adContainer = document.createElement('div');
      adContainer.classList.add('ad-container');

      const adHtml = await fetchAdApi('poll')
      adContainer.innerHTML = adHtml;
      return adContainer;
    }

    const getPollResults = async (pollId, ques) => {
      try {
        if (!pollId || !ques) {
          return null;
        }
        const res = await fetch(`https://post-summary.yukta.one/get_poll_results`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ poll_id: pollId, question: ques }),
        });
        const data = await res.json();
        if (data?.length > 0) {
          return data
        } else {
          return data?.detail
        }
      } catch (error) {
        console.error('Error posting data:', error);
        return null;
      }
    }

        const renderPollHeading = () => {
        const headingContainer = document.createElement('div')
        headingContainer.classList.add('plugin-heading-text')

        const headingBG = document.createElement('div')
        headingBG.classList.add('pull-heading-bg')  //pull is not a typo, I am trying to match the class names as per the css

        const pluginName = document.createElement('div');
        pluginName.classList.add('pull-plugin-name');

        const titleAnimation = document.createElement('div');
        titleAnimation.classList.add('title-animation');
        const text = document.createElement('h2');
        text.textContent = 'YM Poll';
        pluginName.appendChild(titleAnimation);
        pluginName.appendChild(text);

        const headingContent = document.createElement('div')
        headingContent.classList.add('section-heading')

        const headingText = document.createElement('div')
        headingText.classList.add('pull-section-heading-text')
        headingText.innerHTML = '<h3 class="summary-heading">Gift and Voucher for Premium Customers</h3><div class="sub-heading"><a href="">View T&amp;C</a></div>'

        const headingIcon = document.createElement('div')
        headingIcon.classList.add('section-heading-icon')
        headingIcon.innerHTML = '<img alt="#" data-src="https://raw.githubusercontent.com/shefaligoyal17/poll-script/refs/heads/main/assets/img/Untitled-1.gif" class=" lazyloaded" src="https://raw.githubusercontent.com/shefaligoyal17/poll-script/refs/heads/main/assets/img/Untitled-1.gif">'

        headingContent.appendChild(headingText)
        headingContent.appendChild(headingIcon)

        headingContainer.appendChild(headingBG);
        headingContainer.appendChild(pluginName);
        headingContainer.appendChild(headingContent);

        return headingContainer;
      }

    const RenderPollResults = (pollResultArr) => {
      const pollResultContainer = document.createElement('div');
      pollResultContainer.classList.add('poll-results-container');

      const ResultTitle = document.createElement('h3');
      ResultTitle.textContent = 'Poll Results:';

      const pollResultList = document.createElement('ul');

      pollResultArr.forEach(({ answer, percentage}) => {
        const listItem = document.createElement('li');

        const label = document.createElement('div');
        label.classList.add('percentage-label')
        label.innerHTML = `<span>${answer}</span><span class="percentage">${percentage}%</span>`;

        const percentageProgress = document.createElement('div');
        percentageProgress.classList.add('percentage-progress');
        percentageProgress.innerHTML = `<div class="percentage-bar" style="width: ${percentage}%;"></div>`;

        listItem.appendChild(label);
        listItem.appendChild(percentageProgress);

        pollResultList.appendChild(listItem);
      })

      pollResultContainer.appendChild(ResultTitle);
      pollResultContainer.appendChild(pollResultList);

      return pollResultContainer

    }

    const RenderPollBanner = async (bannerId, targetSelector) => {
      const poll = await fetchApi(bannerId);
      let selectedOption;
      if (poll) {
        // Create the banner container
        const pollGameWrapper = document.createElement('div');
        pollGameWrapper.classList.add('poll-game-wrapper');

        const pollWidgetWrapperHeader = document.createElement('div');
        pollWidgetWrapperHeader.classList.add('poll-widget-wrapper-header');

        const pollWidgetWrapperContent = document.createElement('div');
        pollWidgetWrapperContent.classList.add('poll-widget-wrapper-content');
        pollWidgetWrapperContent.id = `data-poll-id-${bannerId}`

        const pollBox = document.createElement('div');
        pollBox.classList.add('poll-box', 'animated', 'fade-in');

        //Question
        const pollQuestion = document.createElement('h3');
        pollQuestion.classList.add('poll-question');
        pollQuestion.textContent = poll.question;

        // Radio Container
        const radioContainer = document.createElement('div');
        const radioName = `pollType-${bannerId}-${targetSelector}`;

        // Poll Options
        poll.options.forEach((option, index) => {
          //Parent div
          const div = document.createElement('div');
          div.classList.add('poll-option', 'animated', 'fade-in');

          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.id = `option-${index}-${bannerId}-${targetSelector}`;
          radio.name = radioName;
          radio.value = option;

          radio.addEventListener('change', (event) => {
            selectedOption = event.target.value;
        });

          const label = document.createElement('label');
          label.setAttribute('for', `option-${index}-${bannerId}-${targetSelector}`);
          label.textContent = option;

          div.appendChild(radio);
          div.appendChild(label);
          radioContainer.appendChild(div);
        })

        const submitBtnContainer = document.createElement('div');
        submitBtnContainer.classList.add('submit-btn-container');

        //submit button for selected option
        const submitButton = document.createElement('button');
        submitButton.classList.add('submit-poll-btn');
        submitButton.textContent = 'Submit';
        submitButton.addEventListener('click', async (event) => {
          event.preventDefault();
          // send selected option to server
          const status = await PostUserResponse(bannerId, poll.question, selectedOption);
          if (status) {
            // alert('Your response has been submitted successfully');
            pollBox.removeChild(radioContainer);
            
            //get poll results
            const pollResults = await getPollResults(bannerId, poll.question);
            const pollResultElement = RenderPollResults(pollResults)
            pollBox.appendChild(pollResultElement)
            console.log('pollresults',pollResults)
          } else {
            console.log('Failed to submit response. Please try again.');
          }
        });

        submitBtnContainer.appendChild(submitButton);
        radioContainer.appendChild(submitBtnContainer);
        
        pollBox.appendChild(pollQuestion);
        pollBox.appendChild(radioContainer);

        const adContent = await renderAdContent()

        pollWidgetWrapperContent.appendChild(pollBox);
        pollWidgetWrapperContent.appendChild(adContent);
        
        pollWidgetWrapperHeader.appendChild(pollWidgetWrapperContent);

        const headingContainer = renderPollHeading()

        pollGameWrapper.appendChild(headingContainer);
        pollGameWrapper.appendChild(pollWidgetWrapperHeader);

        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
          targetElement.appendChild(pollGameWrapper);
        } else {
          console.error(`Target element "${targetSelector}" not found. Appending to body instead.`);
          document.body.appendChild(pollGameWrapper);
        }
        
      } else {
        console.error('No summary or detail available.');
      }
    };
    
    RenderPollBanner(id, targetSelector);
  };

// Function to dynamically load a CSS file
const loadQuizCSS = (cssUrl) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  link.type = 'text/css';
  document.head.appendChild(link);
};

const loadQuizGoogleFont = () => {
  const link1 = document.createElement('link');
  link1.rel = "preconnect"
  link1.href="https://fonts.googleapis.com"
  const link2 = document.createElement('link');
  link2.rel = "preconnect"
  link2.href="https://fonts.gstatic.com"
  link2.crossOrigin

  const link = document.createElement('link');
  link.rel ='stylesheet';
  link.href = "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap";
  document.head.appendChild(link1);
  document.head.appendChild(link2);
  document.head.appendChild(link);
}

// Load the CSS file
loadQuizGoogleFont()
loadQuizCSS('https://shefaligoyal17.github.io/quiz-script/quiz-style.css'); // Replace with your hosted CSS file URL

window.QuizNamespace = window.QuizNamespace || {};

window.QuizNamespace.GetQuizBanner = (id, targetSelector = '#my-custom-container') => {
  const fetchApi = async (id) => {
    try {
      const res = await fetch(`https://post-summary.yukta.one/api/quiz/${id}`);
      const data = await res.json();
      if (data?.quiz?.length > 0) {
        return data?.quiz[0];
      } else if (data?.detail) {
        return data.detail;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const PostUserResponse = async (quizId, userAnswer) => {
    try {
      if (!quizId || !userAnswer) {
        return null;
      }
      const res = await fetch(`https://post-summary.yukta.one/submit_quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quiz_id: quizId, user_answer: userAnswer }),
      });
      const data = await res.json();
      if (data?.success) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error posting data:', error);
      return null;
    }
  }

  const fetchAdApi = async (type) => {
    try {
      const res = await fetch(`https://post-summary.yukta.one/api/ad?type=${type}`);
      const data = await res.json();
      if (data?.ad_html) {
        return data.ad_html;
      }
    } catch (error) {
      console.error('Error fetching ad data:', error);
      return null;
    }
  }

  const renderAdContent = async () => {
    const adContainer = document.createElement('div');
    adContainer.classList.add('ad-container');

    const adHtml = await fetchAdApi('quiz')
    adContainer.innerHTML = adHtml;
    return adContainer;
  }

  const renderQuizHeading = () => {
    const headingContainer = document.createElement('div')
    headingContainer.classList.add('plugin-heading-text')

    const headingBG = document.createElement('div')
    headingBG.classList.add('pull-heading-bg')  //pull is not a typo, I am trying to match the class names as per the css

    const pluginName = document.createElement('div');
    pluginName.classList.add('pull-plugin-name');

    const titleAnimation = document.createElement('div');
    titleAnimation.classList.add('title-animation');
    const text = document.createElement('h2');
    text.textContent = 'YM Quiz';
    pluginName.appendChild(titleAnimation);
    pluginName.appendChild(text);

    const headingContent = document.createElement('div')
    headingContent.classList.add('section-heading')

    const headingText = document.createElement('div')
    headingText.classList.add('pull-section-heading-text')
    headingText.innerHTML = '<h3 class="summary-heading">Gift and Voucher for Premium Customers</h3><div class="sub-heading"><a href="">View T&amp;C</a></div>'

    const headingIcon = document.createElement('div')
    headingIcon.classList.add('section-heading-icon')
    headingIcon.innerHTML = '<img alt="#" data-src="https://raw.githubusercontent.com/shefaligoyal17/quiz-script/refs/heads/main/assets/img/Sun.gif" class=" lazyloaded" src="https://raw.githubusercontent.com/shefaligoyal17/quiz-script/refs/heads/main/assets/img/Sun.gif">'

    headingContent.appendChild(headingText)
    headingContent.appendChild(headingIcon)

    headingContainer.appendChild(headingBG);
    headingContainer.appendChild(pluginName);
    headingContainer.appendChild(headingContent);

    return headingContainer;
  }

  const RenderQuizBanner = async (bannerId, targetSelector) => {
    const quiz = await fetchApi(bannerId);
    let selectedOption;

    // Define the event listener function
    const handleOptionClick = (event) => {
      event.preventDefault();
      selectedOption = event.target.value;
      // Change the background color of other options
      const optionContainer = document.querySelector('#quiz-option-container');
      const otherOptions = optionContainer.querySelectorAll('.quiz-option');
      otherOptions.forEach((otherOption) => {
        otherOption.style.backgroundColor = 'white';
      });
      const div = document.querySelector(`#option-${quiz.options.indexOf(selectedOption)}-${bannerId}-${targetSelector}`);
      div.style.backgroundColor = '#e8e8e8';
      div.style.color = 'black';
      div.style.borderColor =  'transparent'
    }

    if (quiz) {
      // Create the banner container
      const quizContainerWidgets = document.createElement('div');
      quizContainerWidgets.classList.add('quiz-container-widgets');
      quizContainerWidgets.id = `banner-${bannerId}-${targetSelector}`;

      const quizContentWrapper = document.createElement('div');
      quizContentWrapper.classList.add('quiz-content-wrapper');

      const quizWidgetWrapperContent = document.createElement('div');
      quizWidgetWrapperContent.classList.add('quiz-widget-wrapper-content');
      quizWidgetWrapperContent.id = `data-quiz-id-${bannerId}-${targetSelector}`

      const quizBox = document.createElement('div');
      quizBox.classList.add('quiz-box');

      //Question
      const quizQuestion = document.createElement('div');
      quizQuestion.classList.add('question');
      quizQuestion.textContent = quiz.question;

      // Button Container
      const optionContainer = document.createElement('div');
      optionContainer.id = 'quiz-option-container';

      // Quiz Options
      quiz.options.forEach((option, index) => {
        //Parent div
        const div = document.createElement('div');
        div.id = `option-${index}-${bannerId}-${targetSelector}`;
        div.value = option
        div.textContent = option        
        div.classList.add('quiz-option');

        //to change selected options style
        div.addEventListener('click', handleOptionClick);

        optionContainer.appendChild(div);
      })

      //submit button for selected option
      const submitButton = document.createElement('button');
      submitButton.classList.add('submit-quiz-btn');
      submitButton.textContent = 'Check Answer';
      submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        // send selected option to server
        const status = await PostUserResponse(bannerId, selectedOption);
        if (status) {
          quizBox.removeChild(submitButton)

          //change style of selected option to green if correct else red and green the correct one
          const correctOption = quiz.answer
          const selectedOptionElement = document.getElementById(`option-${quiz.options.indexOf(selectedOption)}-${bannerId}-${targetSelector}`);

          if (correctOption === selectedOption) {
            selectedOptionElement.style.backgroundColor = '#9feb8e';
            selectedOptionElement.style.color = '#000000';
            selectedOptionElement.innerHTML = `${selectedOption}<span class="list-icon1"><img src="https://raw.githubusercontent.com/shefaligoyal17/quiz-script/bf354b81846122f19438cb627b1af0bd44e37414/assets/img/tick.svg" alt="tick" /></span>`
          }
          else {
            selectedOptionElement.style.backgroundColor ='#fca7a1';
            selectedOptionElement.style.color = '#000000';
            selectedOptionElement.innerHTML = `${selectedOption}<span class="list-icon1"><img src="https://raw.githubusercontent.com/shefaligoyal17/quiz-script/bf354b81846122f19438cb627b1af0bd44e37414/assets/img/cross.svg" alt="tick" /></span>`
            const correctOptionElement = document.getElementById(`option-${quiz.options.indexOf(correctOption)}-${bannerId}-${targetSelector}`);
            correctOptionElement.style.backgroundColor = '#9feb8e';
            correctOptionElement.style.color = '#000000';
            correctOptionElement.style.borderColor = 'transparent';
            correctOptionElement.innerHTML = `${correctOption}<span class="list-icon1"><img src="https://raw.githubusercontent.com/shefaligoyal17/quiz-script/bf354b81846122f19438cb627b1af0bd44e37414/assets/img/tick.svg" alt="tick" /></span>`
          }

          //remove event listener from all options
          const otherOptions = optionContainer.querySelectorAll('.quiz-option');
          otherOptions.forEach((otherOption) => {
            otherOption.removeEventListener('click', handleOptionClick);
          });
          } else {
          console.log('Failed to submit response. Please try again.');
        }
      });

      quizBox.appendChild(quizQuestion);
      quizBox.appendChild(optionContainer);
      quizBox.appendChild(submitButton)

      const adContent = await renderAdContent()

      quizWidgetWrapperContent.appendChild(quizBox);
      quizWidgetWrapperContent.appendChild(adContent);
      
      quizContentWrapper.appendChild(quizWidgetWrapperContent);

      const headingContent = renderQuizHeading()

      quizContainerWidgets.appendChild(headingContent);
      quizContainerWidgets.appendChild(quizContentWrapper);

      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        targetElement.appendChild(quizContainerWidgets);
      } else {
        console.error(`Target element "${targetSelector}" not found. Appending to body instead.`);
        document.body.appendChild(quizContainerWidgets);
      }

    } else {
      console.error('No summary or detail available.');
    }
  };

  RenderQuizBanner(id, targetSelector);
};


// Function to dynamically load a CSS file
const loadSummaryCSS = (cssUrl) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  link.type = 'text/css';
  document.head.appendChild(link);
};

const loadSummaryGoogleFont = () => {
  const link1 = document.createElement('link');
  link1.rel = "preconnect"
  link1.href="https://fonts.googleapis.com"
  const link2 = document.createElement('link');
  link2.rel = "preconnect"
  link2.href="https://fonts.gstatic.com"
  link2.crossOrigin

  const link = document.createElement('link');
  link.rel ='stylesheet';
  link.href = "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap";
  document.head.appendChild(link1);
  document.head.appendChild(link2);
  document.head.appendChild(link);
}

// Load the CSS file
loadSummaryGoogleFont()
loadSummaryCSS('https://aleemescanor.github.io/summaryPlugin/summary-style.css'); // Replace with your hosted CSS file URL

window.SummaryNamespace = window.SummaryNamespace || {};

window.SummaryNamespace.GetSummaryBanner = (id, targetSelector) => {
  const fetchApi = async (id) => {
    try {
      const res = await fetch(`https://post-summary.yukta.one/api/summary/${id}`);
      const data = await res.json();
      if (data?.summary) {
        return data.summary;
      } else if (data?.detail) {
        return data.detail;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const fetchAdApi = async (type) => {
    try {
      const res = await fetch(`https://post-summary.yukta.one/api/ad?type=${type}`);
      const data = await res.json();
      if (data?.ad_html) {
        return data.ad_html;
      }
    } catch (error) {
      console.error('Error fetching ad data:', error);
      return null;
    }
  };

  const RenderSummaryBanner = async (bannerId, targetSelector = '#my-custom-container') => {
    const summary = await fetchApi(bannerId);
    const adHtml = await fetchAdApi('summary');

    const renderSummaryHeading = () => {
      const headingContainer = document.createElement('div');
      headingContainer.classList.add('heading-container');

      const headingBG = document.createElement('div');
      headingBG.classList.add('heading-container-bg');

      const pluginName = document.createElement('div');
      pluginName.classList.add('plugin-name');
      pluginName.textContent = 'YM Summary';

      const headingContent = document.createElement('div');
      headingContent.classList.add('heading-content');

      const headingText = document.createElement('div');
      headingContent.classList.add('heading-text');
      headingText.innerHTML = '<h3 class="summary-heading">Gift and Voucher for Premium Customers</h3><a href="https://eplus.yukta.one">View T&amp;C</a>';

      const headingIcon = document.createElement('div');
      headingContent.classList.add('heading-icon');
      headingIcon.innerHTML =
        '<img alt="#" data-src="https://eplus.yukta.one/wp-content/plugins/summary-quiz-ad/assets/img/Untitled-1.gif" class=" lazyloaded" src="https://eplus.yukta.one/wp-content/plugins/summary-quiz-ad/assets/img/Untitled-1.gif">';

      headingContent.appendChild(headingText);
      headingContent.appendChild(headingIcon);

      headingContainer.appendChild(headingBG);
      headingContainer.appendChild(pluginName);
      headingContainer.appendChild(headingContent);

      return headingContainer;
    };

    if (summary && adHtml) {
      // The parent container
      const summaryContainer = document.createElement('div');
      summaryContainer.classList.add('summary-container');

      // Create the banner container
      const summaryContentWrapper = document.createElement('div');
      summaryContentWrapper.classList.add('summary-content-wrapper');
      summaryContentWrapper.id = `banner-${bannerId}-${targetSelector.replace('#', '')}`;

      const pluginData = document.createElement('div');
      pluginData.classList.add('plugin-data');

      const summaryContentBlock = document.createElement('div');
      summaryContentBlock.classList.add('summary-content-block');

      // For ad
      const AdContent = document.createElement('div');
      AdContent.classList.add('ad-content');
      AdContent.innerHTML = adHtml;

      // Radio buttons
      const radioContainer = document.createElement('div');
      radioContainer.classList.add('summary-controls');

      const radioName = `summaryType-${bannerId}-${targetSelector.replace('#', '')}`;

      const radioLong = document.createElement('input');
      radioLong.type = 'radio';
      radioLong.id = `long-${bannerId}-${targetSelector.replace('#', '')}`;
      radioLong.name = radioName;

      const radioMedium = document.createElement('input');
      radioMedium.type = 'radio';
      radioMedium.id = `medium-${bannerId}-${targetSelector.replace('#', '')}`;
      radioMedium.name = radioName;

      const radioShort = document.createElement('input');
      radioShort.type = 'radio';
      radioShort.id = `short-${bannerId}-${targetSelector.replace('#', '')}`;
      radioShort.name = radioName;
      radioShort.checked = true;

      const labelLong = document.createElement('label');
      labelLong.setAttribute('for', `long-${bannerId}-${targetSelector.replace('#', '')}`);
      labelLong.textContent = 'Long';
      labelLong.appendChild(radioLong);

      const labelMedium = document.createElement('label');
      labelMedium.setAttribute('for', `medium-${bannerId}-${targetSelector.replace('#', '')}`);
      labelMedium.textContent = 'Medium';
      labelMedium.appendChild(radioMedium);

      const labelShort = document.createElement('label');
      labelShort.setAttribute('for', `short-${bannerId}-${targetSelector.replace('#', '')}`);
      labelShort.textContent = 'Short';
      labelShort.appendChild(radioShort);

      radioContainer.appendChild(labelShort);
      radioContainer.appendChild(labelMedium);
      radioContainer.appendChild(labelLong);

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('summary-content');
      contentDiv.innerHTML = `<p>${summary.short}</p>`;

      summaryContentBlock.appendChild(radioContainer);
      summaryContentBlock.appendChild(contentDiv);

      pluginData.appendChild(summaryContentBlock);
      pluginData.appendChild(AdContent);

      summaryContentWrapper.appendChild(pluginData);

      const headingContainer = renderSummaryHeading();
      summaryContainer.appendChild(headingContainer);
      summaryContainer.appendChild(summaryContentWrapper);

      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        targetElement.appendChild(summaryContainer);
      } else {
        console.error(`Target element "${targetSelector}" not found. Appending to body instead.`);
        document.body.appendChild(summaryContainer);
      }

      radioLong.addEventListener('change', () => {
        contentDiv.innerHTML = `<p>${summary.long}</p>`;
      });

      radioMedium.addEventListener('change', () => {
        contentDiv.innerHTML = `<p>${summary.medium}</p>`;
      });

      radioShort.addEventListener('change', () => {
        contentDiv.innerHTML = `<p>${summary.short}</p>`;
      });
    } else {
      console.error('No summary or detail available.');
    }
  };

  RenderSummaryBanner(id, targetSelector);
};
