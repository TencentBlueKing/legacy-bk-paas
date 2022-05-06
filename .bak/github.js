const request = require('request')

const API_URL_PREFIX = 'https://api.github.com'

const owner = 'TencentBlueKing'
const repo = 'bkui-vue3'

const Authorization = 'token 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'
const UserAgent = 'hLinx'

const prePage = 5

const requestPromise = params => {
    return new Promise((resolve, reject) => {
        request(params, (error, data) => {
            if (error || !data.body) {
                reject(new Error(error))
                return
            }
            resolve(JSON.parse(data.body))
        })
    })
}

const getCommitList = () => {
    return requestPromise({
        method: 'GET',
        url: `${API_URL_PREFIX}/repos/${owner}/${repo}/commits?per_page=${prePage}`,
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': UserAgent,
            Authorization
        },
    })
}

const getIssueList = () => {
    return requestPromise({
        method: 'GET',
        url: `${API_URL_PREFIX}/repos/${owner}/${repo}/issues?per_page=${prePage}`,
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': UserAgent,
            Authorization
        },
    })
}

const closeIssue = (issueNumber) => {
    requestPromise({
        method: 'POST',
        url: `${API_URL_PREFIX}/repos/${owner}/${repo}/issues/${issueNumber}`,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': UserAgent,
          Authorization
        },
        body: JSON.stringify({
            state: 'closed'
        })
      })
}

const addLabelToIssue = (issueNumber, label) => {
    requestPromise({
        method: 'POST',
        url: `${API_URL_PREFIX}/repos/${owner}/${repo}/issues/${issueNumber}/labels`,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': UserAgent,
          Authorization
        },
        body: JSON.stringify({
            labels: [label]
        })
      })
}

const fetchScopeIssueList = () => {
    return Promise.all([
        getCommitList(),
        getIssueList()
    ])
    .then(([commitList, issueList]) => {
        const issueStatusMap = issueList.reduce((result, item) => {
            result[item.number] = item.state
            return result
          }, {})
        
        return commitList.reduce((result, item) => {
            const commitMessage = item.commit.message.match(/#(\d+)$/)
            if (!commitMessage) {
                return result
            }
            const issueNumber = commitMessage[1]
            if (issueStatusMap[issueNumber] === 'open') {
                result.push(issueNumber)
            }
            return result
        }, [])
    })
}

/**
 * @desc 测试阶段的任务
 * 
 * 提交 commit 自动更新文档后会给 commit 关联的 issue 打上 test label
 */
const taskEnterTest = () => {
    fetchScopeIssueList()
    .then(issueList => {
        Promise
        .all(issueList.map(issueNumber => addLabelToIssue(issueNumber, 'test')))
        .then(() => {
            console.log('success')
        })
    })
}

/**
 * @desc 发布阶段的任务
 * 
 * 给将要发布的 issue 打上 prod label，并关闭 issue
 */
const taskEnterRelase = () => {
    fetchScopeIssueList()
    .then(issueList => {
        Promise
        .all(issueList.map(issueNumber => Promise.all([
            addLabelToIssue(issueNumber, 'prod'),
            closeIssue(issueNumber)
        ])))
        .then(() => {
            console.log('success')
        })
    })
}

taskEnterRelase()

