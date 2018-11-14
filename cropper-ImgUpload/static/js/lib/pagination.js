/**
 * Create with WebStorm
 * Author: Daxiu Huang
 * CreateTime: 2017/9/6 10:21
 */
//分页组件
var pageComponent = Vue.extend({
    template: `<nav aria-label="Page navigation" v-if="showPageBtn!=0">
        <span class="curPageSizeW"  v-if="showPageSizes!=0">每页显示
            <span v-for="(oneps,index) in showPageSizes" v-if="index==0" @click="goPage(curPage,$event)" tp="curPageSize" class="curPageSize curPageSizeCk">{{oneps}}</span>
            <span v-for="(oneps,index) in showPageSizes" v-if="index!=0" @click="goPage(curPage,$event)" tp="curPageSize" class="curPageSize">{{oneps}}</span>
        </span>
        <ul class="pagination">
            <li :class="{\'disabled\':curPage==1}">
                <a href="javascript:;" tp="curPageNo" @click="goPage(curPage==1?1:curPage-1,$event)" aria-label="Previous" style="line-height: 23px;font-size: 16px;">
                    &laquo;
                </a>
            </li>
            <li v-for="page in showPageBtn" :class="{\'active\':page==curPage}">
                <a href="javascript:;" tp="curPageNo" v-if="page" @click="goPage(page,$event)">{{page}}</a>
                <a href="javascript:;" tp="curPageNo" v-else @click="goPage(-1,$event)">···</a>
            </li>
            <li :class="{\'disabled\':curPage==pages}">
                <a href="javascript:;" tp="curPageNo" @click="goPage(curPage==pages?pages:curPage+1,$event)" aria-label="Next" style="line-height: 23px;font-size: 16px;">
                    &raquo;
                </a>
            </li>
        </ul>
    </nav>`,
    props: {
        pages: {
            type: Number,
            default: 1
        },
        pagesizes: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            curPage: 1,
            pageSize: this.pagesizes ? this.pagesizes.split(',')[0] : 10
        }
    },
    computed: {
        showPageBtn() {
            let pages = this.pages;
            let pageNum = pages;
            let index = this.curPage;
            let arr = [];

            if (this.curPage > pageNum && pageNum != 0) {
                this.curPage = pageNum;
                this.$emit('navpage', this.curPage, this.pageSize);
            }


            if (pageNum <= 5) {
                for (let i = 1; i <= pageNum; i++) {
                    arr.push(i)
                }
                return arr
            }
            if (index <= 2) return [1, 2, 3, 0, pageNum];
            if (index >= pageNum - 1) return [1, 0, pageNum - 2, pageNum - 1, pageNum];
            if (index === 3) return [1, 2, 3, 4, 0, pageNum];
            if (index === pageNum - 2) return [1, 0, pageNum - 3, pageNum - 2, pageNum - 1, pageNum];

            return [1, 0, index - 1, index, index + 1, 0, pageNum];
        },
        showPageSizes() {
            let pagesizes = this.pagesizes;
            if (pagesizes != undefined) {
                if (pagesizes != '' && pagesizes != 0) {
                    var pagesizeslist = pagesizes.split(',');
                    return pagesizeslist;
                } else {
                    return 0;
                }
            } else {
                return [10, 20, 30, 40, 50];
            }
        }
    },
    methods: {
        goPage(page, e) {
            if (page == -1) {
                if ($(e.target).parent().prev().children().html() == '1') {
                    page = this.curPage - 3;
                } else {
                    page = this.curPage + 3;
                }
            }
            if (e.target.attributes.tp.value == 'curPageSize' && !$(e.target).hasClass('curPageSizeCk')) {
                this.curPage = 1;
                $(e.target).siblings().removeClass('curPageSizeCk');
                $(e.target).addClass('curPageSizeCk');
                this.pageSize = $(e.target).html();
                this.$emit('navpage', this.curPage, this.pageSize);
            }
            if (e.target.attributes.tp.value == 'curPageNo' && page != this.curPage) {
                this.curPage = page;
                this.$emit('navpage', this.curPage, this.pageSize);
            }
        }
    }
});
Vue.component('navigation', pageComponent);