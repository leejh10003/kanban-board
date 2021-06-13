<template>
  <div v-if="$apollo.queries.boards_progress.loading">
  </div>
  <div v-else style="display: flex; flex-direction: row">
    <div class="graph-card">
      <h3 style="text-align: left">진척도</h3>
      <div class="graphs">
        <apexchart width="400" type="radialBar" :series="wholePercentageMean.data" :options="wholePercentageMean"></apexchart>
        <apexchart width="400" type="radialBar" :series="wholeWeightedMean.data" :options="wholeWeightedMean"></apexchart>
      </div>
    </div>
    <div class="graph-card">
      <h3 style="text-align: left">보드 별 통계</h3>
      <div class="graphs">
        <apexchart width="400" type="bar" :series="finishedCards.series" :options="finishedCards"></apexchart>
        <apexchart width="400" type="bar" :series="progression.series" :options="progression"></apexchart>
      </div>
    </div>
    <div class="graph-card" style="width: max(300px, 30vw)">
      <h3 style="text-align: left">사용자 통계</h3>
      <div >
        <div style="width: 100%;">
          <h4 style="text-align: left;">참여중인 보드 수</h4>
          <div style="width: 100%; text-align: center; font-size: 30px; font-weight: bold; padding: 30px">{{boardNumber}} 개</div>
        </div>
      </div>
      <h3 style="text-align: left">사용자 통계</h3>
      <div style="display: flex; flex-direction: row">
        <div style="width: 100%;">
          <h4 style="text-align: left;">완료된 보드 수</h4>
          <div style="width: 100%; text-align: center; font-size: 30px; font-weight: bold; padding: 30px">{{finished}} 개</div>
        </div>
      </div>
      <h3 style="text-align: left">조언</h3>
      <p style="text-align: left; font-weight: 600" v-if="boardNumber < 3"> 과도하게 많은 프로젝트에 참여하지 않고 계시는군요,
        적정 수준에서 수행하는 프로젝트의 갯수를 유지하는 것은 정신 건강과 생산성에 매우 긍정적인 영향을 줍니다.<br/>
        또한 현재 진행중인 업무에 대해 주의가 분산되는 것을 방지하고, 일상적인 업무에 대해서 통제력을 상실하는 것을 방지합니다. 아주 잘 하고 계시네요!</p>
      <p style="text-align: left; font-weight: 600" v-else-if="boardNumber < 5"> 상당히 많은 양의 프로젝트에 참여중이십니다.
        아직 과도한 수준은 아니지만, 동시에 많은 업무를 수행하는 것은 개별 업무의 완결성을 떨어뜨리고 잦은 실수를 유발할 수 있습니다.<br/>
        동시에 참여해야 하는 프로젝트의 갯수가 점점 증가하는 추세라면, 각 프로젝트의 장과 상의하여 업무 연관도가 높은 인원에게 인수인계를 하는 것을 추천드립니다.
      <p style="text-align: left; font-weight: 600" v-else>과도하게 많은 양의 프로젝트에 참여하고 계신 것으로 보입니다.
        지나치게 많은 프로젝트에 참여하는 것은 생산성도 낮출 뿐 아니라, 대인관계에 악영향을 끼치고 각종 신체 질병을 유발할 가능성을 높입니다.<br/>
        혹시 많은 프로젝트에 대한 보고를 받기 위해서 프로젝트에 참여 중이시라면, 다른 방법으로 팀원과 소통하는 것을 추천드립니다. 프로젝트가 종료된 보드는 완료처리 하는 것, 잊지 마세요!</p>
      <br/>
    </div>
  </div>
</template>
<style>
.graph-card{
  background: white;
  width: max(450px, 35vw);
  box-shadow: 0 15px 15px 1px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  display: block;
  padding: 30px;
  margin: 30px;
}
.graphs{
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
<script>
import { getToken } from '../vue-apollo'
import gql from 'graphql-tag'
export default {
  async beforeCreate(){
    await getToken();
    if (!this.$store.state.loggedIn){
      this.$router.push('/naverAuth')
    }
  },
  data() {
    return {
      finished: 0,
      boardNumber: 0,
      finishedCards: {
          series: [{
          name: '완료 수',
          data: []
        }],
        chart: {
          toolbar: {
            show: true,
            tools: {
              download: false
            }
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: '완료한 카드의 갯수'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return `${val} 개`
            }
          }
        }
      },
      progression: {
          series: [{
          name: '진척도',
          data: []
        }],
        chart: {
          toolbar: {
            show: true,
            tools: {
              download: false
            }
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: '보드별 진척도'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return `${val} %`
            }
          }
        }
      },
      wholePercentageMean: {
        data: [0],
        labels: ['보드 평균 진척'],
        colors: ['red'],
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 15,
              size: "60%"
            },
            dataLabels: {
              showOn: "always",
              name: {
                offsetY: -10,
                show: true,
                fontSize: "13px"
              },
              value: {
                color: "#111",
                fontSize: "30px",
                show: true
              }
            }
          }
        }
      },
      wholeWeightedMean: {
        data: [0],
        labels: ['전체 진척'],
        colors: ['red'],
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 15,
              size: "60%"
            },
            dataLabels: {
              showOn: "always",
              name: {
                offsetY: -10,
                show: true,
                fontSize: "13px"
              },
              value: {
                color: "#111",
                fontSize: "30px",
                show: true
              }
            }
          }
        }
      },
    }
  },
  apollo: {
    boards_progress: {
      variables(){
        return {
          id: this.$store.state.id
        }
      },
      query: gql`query ($id: Int!) {
        boards_progress(where: {user_id: {_eq: $id}}) {
          progress
          finished_num
          card_num
          board{
            name
            id
          }
        }
      }`,
      update(data){
        const wholeCardNumber = data.boards_progress.map(({card_num}) => card_num).reduce((former, latter) => former + latter, 0)
        const wholePercentageMean = data.boards_progress.map(({progress}) => progress).reduce((former, latter) => former + latter, 0)
        const wholeWeightedMean = data.boards_progress.map(({progress, card_num}) => progress * card_num / wholeCardNumber).reduce((former, latter) => former + latter, 0)
        this.wholePercentageMean.data = [wholePercentageMean]
        this.wholePercentageMean.colors = [wholePercentageMean < 30 ? '#e91e63' : (wholePercentageMean < 60 ? '#ffc107' : '#29b6f6')]
        this.wholeWeightedMean.data = [wholeWeightedMean]
        this.wholeWeightedMean.colors = [wholeWeightedMean < 30 ? '#e91e63' : (wholeWeightedMean < 60 ? '#ffc107' : '#29b6f6')]
        const finished = data.boards_progress.map(({finished_num, board: {name}}) => ({finished_num, name})).sort((former, latter) => latter.finished_num - former.finished_num).slice(0, 6)
        this.finishedCards.series[0].data = finished.map(({finished_num}) => finished_num)
        this.finishedCards.xaxis.categories = finished.map(({name}) => name)
        const progression = data.boards_progress.map(({progress, board: {name}}) => ({progress, name})).sort((former, latter) => latter.progress - former.progress).slice(0, 6)
        this.progression.series[0].data = progression.map(({progress}) => progress)
        this.progression.xaxis.categories = progression.map(({name}) => name)
        this.boardNumber = data.boards_progress.length
        this.finished = data.boards_progress.filter((board) => board.progress === 100).length
        this.data = data.boards_progress
      }
    }
  }
}
</script>