<template lang="pug">
  .faq(v-if="type === 1")
    .faq__bg(:style="{ backgroundImage: 'url(' + bgImage + ')' }")
    .faq__header
      i.fas.fa-chevron-left(@click="back")
      p 帮助中心
    .faq__search
      el-input(type="text" v-model="searchText" @change="search")
      i.fas.fa-search.position-absolute.pl-2
    .faq__remind 仍需要帮助？</br>我们提供 7x24 小时的
      a.px-1(@click="service") 在线客服
      | 随时待命
    .faq__main
      .faq__main__question(v-for="(item, index) in faqdata" @click="setSelectDate(item)")
        i.fas(:class="item.iconClass")
        p {{ item.title }}

  .faqContent(v-else-if="type === 2")
    .faqContent__header
      .faqContent__header__back(@click="type = 1")
        i.fas.fa-chevron-left
      p {{ selectTitle }}
    .faqContent__main
      .faqContent__main__question(v-for="item in selectDate" @click="setDetailData(item)")
        p {{ item.q }}
        i.fas.fa-chevron-right

  //- 搜尋
  .faqContent(v-else-if="type === 3")
    .faqContent__header
      .faqContent__header__back(@click="type = 1")
        i.fas.fa-chevron-left
      p 搜索结果
    .faqContent__main
      p.faqContent__main__title 搜索與"{{ searchText }}"相關的問題：
      div(v-if="searchDate.length === 0")
        h1 hello world
      div(v-else v-for="item in searchDate")
        p.faqContent__main__subTitle 【 {{item.title}} 】
        .faqContent__main__question(v-for="subItem in item.data" @click="setDetailData(subItem, item.title)")
          p {{ subItem.q }}
          i.fas.fa-chevron-right

  //- 詳細
  .faqDetail(v-else-if="type === 4")
    .faqDetail__header
      .faqDetail__header__back(@click="type = 2")
        i.fas.fa-times
      p {{ detailTitle }}
    .faqDetail__main
      .faqDetail__main__title {{ detailDate.q }}
      .faqDetail__main__content {{ detailDate.a }}

  //- 詳細
  .faqDetail(v-else-if="type === 5")
    .faqDetail__header
      .faqDetail__header__back(@click="type = 3")
        i.fas.fa-times
      p {{ detailTitle }}
    .faqDetail__main
      .faqDetail__main__title {{ detailDate.q }}
      .faqDetail__main__content {{ detailDate.a }}
</template>

<script>
export default {
  data() {
    return {
      bgImage: `${process.env.VUE_APP_IMG}/static/img/headerBg@3x.png`,
      type: 1,
      // select
      selectTitle: '',
      selectDate: [],
      // search
      searchTitle: '',
      searchText: '',
      searchDate: [],
      // detail
      detailTitle: '',
      detailDate: {},
      faqdata: [
        {
          "title": "存款问题？",
          "des": "关于存款的步骤、常见问题与应注意事项",
          "iconClass": "fa-fist-raised",
          "questions": [
            {
              "q": "网银该如何进行存款?",
              "a": "1.如未开通网上银行，须请您先到当地银行柜台开通网上银行业务。 2.存款前请先登录倍利账号，然后在页面点击【存款】选择网银支付。3.填写存款金额——选择相应银行——点击立即存款——按照页面提示登录个人网上银行——存款完成。 "
            },
            {
              "q": "如何使用“极速支付”进行存款?",
              "a": "1.登录倍利账号后在页面点击【存款】选择极速转账。 2. 登录个人网上银行——转账汇款——复制收款人信息， 填到对应的表单——填写存款金额——附言处填写正确附言代码——存款完成。"
            },
            {
              "q": "没有网银如何充值？",
              "a": "选择微信支付或支付宝存款，扫一扫即可直接到账。"
            },
            {
              "q": "网银存款附言是什么？一定要填吗？",
              "a": "在您通过转账时，建议您在备注/附言/用途等处填写附言编码，可及时到账。"
            },
            {
              "q": "存款至旧的银行卡账户怎么办？",
              "a": "每次存款前请登录官网获取最新的银行卡账户，存至旧的银行卡账户将导致存款无法到账。"
            },
            {
              "q": "存款一般多久到账？",
              "a": "1. 极速网银快捷、微信、支付宝：完成支付后一般都是即时到账，如果出现延迟到账，请联系在线客服。 2. 银行转账：相关部门会在确认到款项后的5分钟内办理到账。 記得填写正确的附言编码，即可实时到账。"
            },
            {
              "q": "延迟到账怎么办？",
              "a": "款项出现延迟到账的几种情况：1. 银行系统维护或者系统延迟，导致款项延迟。一般出现在银行转账中，玩家可以耐心等待，等待款项到账后，再提交证明即可。 2. 使用微信存款或者极速存款，由于系统延迟，导致款项延迟超过30分钟。玩家可以联系在线客服咨询详细情况，在线客服会协助您查询存款回单。"
            }
          ]
        },
        {
          "title": "提款问题",
          "des": "关于提款的步骤、常见问题与应注意事项",
          "iconClass": "fa-coins",
          "questions": [
            {
              "q": "提款是否需要手续费？",
              "a": "提款时无需您承担任何的手续费，一切费用均由我司承担，祝您游戏愉快。"
            },
            {
              "q": "支持提款银行有哪些？",
              "a": "我们网站支持的提款银行有：中国银行、中国工商银行、中国建设银行、中国农业银行、中国招商银行、中国交通银行、中国光大银行、中国邮政储蓄银行、平安银行、中国民生银行、浦发银行、广发银行、中国中信银行、华夏银行、兴业银行、南京银行、广州银行、长安银行、其他银行。建议您使用五大银行。"
            },
            {
              "q": "为什么任何一笔存款都需要打一倍流水？",
              "a": "为了防止套利者进行洗钱行为，任何一笔存款都必须一倍流水才能提款。"
            },
            {
              "q": "如何进行提款？",
              "a": "1. 电脑网页端：登陆帐号后点击右上角頭像後，点击“提款”；手机端：点击界面上方“存提款”。 2. 进入页面后会有流水检测功能，会有提示打码量，完成打码量后输入下方取款金额，如果未添加银行卡信息需要绑定银行卡，选择银行名称，输入开户姓名、开户账号、开户行，点击下方取款即可。"
            },
            {
              "q": "提款单笔限额和次数是多少？",
              "a": "提款金额单笔最低100元最高5万，每天最多可提款5次，每日最高款25万。"
            },
            {
              "q": "可以用多少张银行卡提款？",
              "a": "可绑定与注册姓名一致的多张提款卡。在账户中心选择取款银行卡，点击新增进行添加。"
            },
            {
              "q": "网站允许一张银行卡绑定多次吗？",
              "a": "网站一张银行卡只允许绑定一个会员账号，不可以多次绑定。"
            }
          ]
        },
        {
          "title": "注册问题",
          "des": "关于注册的步骤、常见问题与应注意事项",
          "iconClass": "fa-gift",
          "questions": [
            {
              "q": "该如何进行注册？",
              "a": "使用帳號密碼註冊 1. 点击网站右上角“註冊”的按键。 2. 进入注册页面填写“帳號與密碼”，即可完成注册。 3. 如果注册信息栏有提示错误，代表该信息不符合要求，请根据提示重新填写。"
            },
            {
              "q": "注册须知",
              "a": "1. 为了规范网站游戏账户管理，每一位会员只允许注册一个游戏账户，请您填写真实的姓名，提款需绑定和注册姓名一致的银行卡。 2. 同一用户名，邮箱以及电话只能注册一个游戏账户，如果该信息已被使用，将无法再次被用于注册新账户。  3. 密码：为了保障您的账户安全，密码不可与用户名相同。"
            },
            {
              "q": "忘记密码？",
              "a": "点击右上角“忘记密码”输入您需要找回登录密码的用户名和预留邮箱获取密码。如果您的邮箱未收到邮件，请咨询在线客服人员。  "
            },
            {
              "q": "如何更改密码？",
              "a": "電腦端1. 请您登录會員账户后，点击上方的“個人中心”。 2. 點擊左側列表“安全中心”，在“密码管理”点击「修改密碼」。3. 在視窗中填写新旧密码並点击“提交綁定”即可完成修改。"
            },
            {
              "q": "会员账号注册成功后可以修改吗？",
              "a": "1. 若您使用帐号注册，非常的抱歉是不可以的，每个会员注册成功会员账号后一经确认是无法进行修改的。 2. 若您使用手机号码注册，由于帐号是由系统先帮您产生，您可至我的/个人中心 → 「安全中心」内，进行帐号修改。请注意帐号只能修改一次。  。"
            }
          ]
        },
        {
          "title": "优惠问题",
          "des": "关于优惠的步骤、常见问题与应注意事项",
          "iconClass": "fa-gift",
          "questions": [
            {
              "q": "首存优惠如何申请？",
              "a": "首存优惠38%和首存优惠50%需要存款后转入置顶的游戏钱包，然后点击“账户中心”，选择“我的优惠”，点击申请参与即可，稍等待5-10分钟会自动进行审核处理（期间不得进行投注，否则无法享受该优惠）。"
            },
            {
              "q": "返水何时派发？",
              "a": "返水最迟次日下午(北京时间18:00 pm)前系统自动派发、无需申请，只需一倍流水即可提款（不限游戏平台）。"
            },
            {
              "q": "返水派发的比例是多少？",
              "a": "依据不同的游戏分类与投注金额，提供不同的反水比例。详情请参阅优惠活动内容唷！"
            }
          ]
        },
        {
          "title": "体育相关问题",
          "des": "体育怎么玩怎么好玩",
          "iconClass": "fa-futbol",
          "questions": [
            {
              "q": "倍利体育平台有效流水细则 ",
              "a": "1. 倍利体育仅对已结算并产生输赢结果的投注额进行计算流水。2. 任何走盘、取消的赛事、对押等(包括串关和单双)赔率低于欧洲盘1.70，香港盘0.70的投注将不计算在有效流水内。请您在投注时，尽量选择符合有效流水的内容进行投注，否则很可能造成您无法提款或者无法领取每日返水。"
            },
            {
              "q": "连串过关如何计算输赢? ",
              "a": "在连串过关中输赢计算是用本金连乘每场的赔率再减去本金。如果投注分股盘，赢半乘以（1+赔率）/2，输半直接乘以0.5。平局场赔率以1计算，如果有一场比赛为输，那么整个注单都算作输。"
            },
            {
              "q": "连串过关流水是如何计算的？",
              "a": "连串过关中所有赛事的平均赔率若低于欧洲盘1.70，香港盘0.70的投注将不计算在有效流水内。平均赔率计算例如：（赔率1.8+赔率1.1+赔率1.6）/3=1.5，即该串关注单为无效流水；（赔率1.65+赔率1.7+赔率1.9）/3=1.75即该串关注单为有效流水。"
            },
            {
              "q": "赛事延期如何计算?",
              "a": "如果比赛或赛事取消，中断或延迟并且没有在官方指定开球时间的36小时内重新开始，所有该场赛事的投注即被视为无效且取消，除非在个别体育规则里另有指定注明。某些无条件终止的盘口将会相应地结算。单独的体育规则中对此类盘口的结算程序做了说明。 公司取消该赛事所有注单的结果被视为最终决定，无需参考官方赛事裁判或相关部门的决定。连串投注将会继续按照注单剩余赛事的赛果结算，该取消赛事的赔率将会按照1计算。"
            }
          ]
        },
        {
          "title": "真人娱乐问题",
          "des": "我就爱看Live",
          "iconClass": "fa-dice",
          "questions": [
            {
              "q": "什么是百家乐？",
              "a": "百家乐是一种简单的纸牌游戏，庄闲各发两手牌。玩家可押注于【庄】或【闲】，点数接近9点的一方即获胜，也可押注【和】局（即庄家和闲家的牌总点数相同）"
            },
            {
              "q": "什么是免佣百家乐？",
              "a": "免佣百家乐是由传统百家乐演变而来，兩者的玩法非常相似，不同的是免佣百家乐增加了一项【超级6】的特别投注，庄家的赔率也有别于传统百家乐。例如：庄家除6点以外赢，赔率为1赔1，庄家6点赢，赔率为1赔0.5。"
            },
            {
              "q": "真人平台最高投注金额为多少？",
              "a": "所有拒绝投注、无效投注、打平、任何出现对压情况的投注（例：於百家乐同时下注庄家及闲家）及任何轮盘之投注将不会计算在累积投注要求内。若所得之红利奖金由投注于上述游戏所得，我们保留不给与客户提取高于所存款项的数额之权利。"
            },
            {
              "q": "结算后可以进行查看当时下注牌面吗？",
              "a": "打开全站并登录账号后进入我的/个人中心→我的投注，选择【真人】--选择厂商后，即可查看到投注的赛事当时的下注牌面。"
            }
          ]
        },
        {
          "title": "彩票相关问题",
          "des": "头奖是我的！！",
          "iconClass": "fa-bowling-ball",
          "questions": [
            {
              "q": "彩票的赔率是多少？",
              "a": "赔率将不时浮动，暂没有固定的赔率，派彩时的赔率将以确认投注时之赔率为准。"
            },
            {
              "q": "彩票最高投注金额是多少？",
              "a": "彩票最高投注是1万， 单期的是2万。"
            },
            {
              "q": "VR彩票最高派彩金额是多少吗？",
              "a": "单期最高利润，200000，（单期利润为同一频道同一期号所有注单的总利润）单挑最高利润：20000,(单期单挑利润为同一频道同一期号所有单挑注单的总利润)。"
            },
            {
              "q": "VR彩票什么时候进行关盘时间？",
              "a": "VR所有游戏项目都是全年无休 每日营业时间总共为21H 营运时间从早上9:00(am)至隔天早上6:00(am)。"
            }
          ]
        },
        {
          "title": "电子竞技问题",
          "des": "电玩选手就是潮！",
          "iconClass": "fa-fist-raised",
          "questions": [
            {
              "q": "电子竞技一般规则",
              "a": "1. 如果比赛没有完成（例如：队员退赛、取消资格或游戏服务器的问题）所有该赛事的投注将被视为无效。2. 如赛事在原定比赛前提前开始，在赛事开始后的所有注单视为无效，滚球投注除外。3. 如果一个队员/队伍在比赛开始前给出至少一个地图的轻易获胜，所有投注在该赛事的注单将被视为无效，除非这个优势在该投注市场已经很明显。4. 如地图/回合的数量和该投注市场所显示的不一致，所有投注将被视为无效。5. 如一个队伍使用一个已知的昵称来比赛或者和至少一个官方玩家游戏，所有的投注视为有效。6. 如一个队伍或者两个队伍有较少队员进行比赛，所有的投注视为有效。7. 一旦比赛开始或者已经杀死，所有投注在个别地图的注单视为有效，将根据官方宣布的赢家计算，包含比赛中队员退赛、取消资格和游戏服务器的问题（延迟/ DDOS）。8. 如果比赛为轻易获胜的判决结果，所有的投注将被视为无效，除非投注在单一已经完成的地图。9. 所有的投注将按照官方正式公布的相关赛果进行结算。如果一场比赛一直在进行（例如：游戏出现BUG或者游戏服务器问题），游戏将立即被通知重置，官方结果适用。"
            },
            {
              "q": "电子竞技投注类型-【独赢】",
              "a": "预测谁将会赢得这场比赛，任何形式的加时或补时将予以计算在内。"
            },
            {
              "q": "电子竞技投注类型-【让分】",
              "a": "1. 预测计算让分结果胜者。任何形式的加时或补时将予以计算在内。2. 电子竞技赛中的让分投注，将授权某队或队员，在地图或回合中处于劣势的一方前面会显示+号，例如：队员A -1.5 1.88  队员B +1.5 1.88如果队员A取得净胜两个或以上地图的胜利，则队员A为胜出选项，队员B为输的选项。如果队员A取得净胜1个地图或队员B赢了，则队员B为胜出选项，队员A为输的选项。3. 在电子竞技赛事中，让分可被视为让回合/地图或其他计算方式，具体取决于相关赛事。让分盘口类型仅会显示让分。 （例如，在反恐精英让分是受让回合，而在魔兽中是让地图数。4. 在单一的反恐精英地图中，如果一场比赛已经开始但未完成（一些回合结束以后队员退赛或取消资格），投注在独赢盘口的注单根据官方宣布的赢家结算，然而投注在回合让分盘的注单将视为无效。"
            },
            {
              "q": "电子竞技投注类型-【让分】",
              "a": "预测在比赛中的总地图数/回合数是否大于或小于盘口数，任何形式的额外时间或加时赛均计算在内。"
            }
          ]
        },
        {
          "title": "其它问题",
          "des": "若您有任何问题欢迎来找我们",
          "iconClass": "fa-question-circle",
          "questions": [
            {
              "q": "游戏出错或有纠纷的情况下我该怎么办? ",
              "a": "请您通过在线客服或者发送邮件到倍利客服信箱 , 联系我们的客服人员，并提供以下信息：1. 問題類型2. 您的倍利账号。3. 詳細說明：包括游戏名称、投注编号、金额、时间。"
            }
          ]
        }
      ],
    }
  },
  methods: {
    setSelectDate(item) {
      this.type = 2;
      this.selectTitle = item.title;
      this.selectDate = item.questions;
      this.detailTitle = item.title;
    },
    search() {
      this.type = 3;
      const temp = [];
      this.faqdata.forEach(item => {
        const result = item.questions.filter(question => question.q.includes(this.searchText) || question.a.includes(this.searchText));
        if (result.length > 0) {
          const tempData = [];
          result.forEach(sub => tempData.push(sub));
          temp.push({
            title: item.title,
            data: tempData,
          });
        };
      });
      this.searchDate = temp;
    },
    setDetailData(subItem, title = {}) {
      if (this.type === 2 ) {
        this.type = 4;
      } else if (this.type === 3) {
        this.type = 5;
        this.detailTitle = title;
      }
      this.detailDate = subItem;
    },
    back() {
      if (window.navigator.userAgent.indexOf('Android') > 0) {
        try {
          window.android.app_gohome();
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          window.webkit.messageHandlers.app_gohome.postMessage('app_gohome');
        } catch (error) {
          console.log(error);
        }
      }
    },
    service() {
      if (window.navigator.userAgent.indexOf('Android') > 0) {
        try {
          window.android.app_service();
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          window.webkit.messageHandlers.app_service.postMessage('app_service');
        } catch (error) {
          console.log(error);
        }
      }
    },
    // for appteam methods
    app_gohome() {
      console.log('app_gohome');
    },
    app_service() {
      console.log('app_service');
    },
  },
  mounted() {
    // for appteam methods
    window.app_gohome = this.app_gohome;
    window.app_service = this.app_service;
  }
}
</script>

<style lang="scss" scoped>
.faq {
  background-color: $origin_lightest;
  display: flex;
  flex-direction: column;
  height: 100%;
  z-index: -1;

  &__bg {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 45vh;
    z-index: 0;
    position: absolute;
    top: 0;
  }

  &__header {
    font-size: $text-20;
    color: white;
    padding: $height-36 $width-24;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    z-index: 0;

    i {
      position: absolute;
      left: $width-24;
      color: white;
    }

    p {
      margin: 0;
    }
  }

  &__search {
    display: flex;
    align-items: center;
    margin-bottom: $height-40;
    padding: 0 $width-28;
    position: relative;
  }

  &__remind {
    z-index: 0;
    text-align: center;
    color: $origin;
    margin-bottom: $height-48;

    a {
      color: rgb(32, 160, 255);
    }
  }

  &__main {
    padding: 0 $width-28;
    z-index: 0;
    flex: 1;

    &__question {
      display: flex;
      align-items: center;
      background-color: white;
      border-radius: 12px;
      padding: $height-24 $width-32;
      margin-bottom: $height-20;

      i {
        margin-right: $width-20;
        color: $origin;
      }

      p {
        margin: 0;
        color: $navy_light;
      }
    }
  }
}

.faqContent {
  background-color: $origin_lightest;
  display: flex;
  flex-direction: column;
  height: 100vh;
  z-index: -1;

  &__header {
    font-size: $text-20;
    color: white;
    background-color: $origin_darkest;
    padding: $height-36 $width-24;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    z-index: 0;

    &__back {
      position: absolute;
      left: $width-24;
      color: white;
    }

    p {
      margin: 0;
    }
  }

  &__main {
    padding: $height-40 $width-24 0;
    flex: 1;
    overflow: auto;

    &__title {
      font-size: $text-16;
      color: $navy_light;
    }

    &__subTitle {
      color: $origin_dark;
      font-size: $text-14;
    }

    &__question {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: white;
      border-radius: 12px;
      padding: $height-24 $width-24;
      margin-bottom: $height-20;
      font-size: $text-16;

      i {
        margin-right: $width-20;
        color: $origin;
      }

      p {
        margin: 0;
        color: $navy_light;
      }
    }
  }
}

.faqDetail {
  background-color: $origin_lightest;
  display: flex;
  flex-direction: column;
  height: 100vh;
  z-index: -1;

  &__header {
    font-size: $text-20;
    color: white;
    background-color: $origin_darkest;
    padding: $height-36 $width-24;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    z-index: 0;

    &__back {
      position: absolute;
      left: $width-24;
      color: white;
    }

    p {
      margin: 0;
    }
  }

  &__main {
    padding: $height-48 $width-28 0;

    &__title {
      color: $navy_dark;
      font-size: $text-20;
      margin-bottom: $height-24;
      font-weight: bold;
    }

    &__content {
      color: $origin_darkest;
      font-size: $text-16;
    }
  }
}

/deep/ .el-input__inner {
  padding: 0 30px;
}
</style>
