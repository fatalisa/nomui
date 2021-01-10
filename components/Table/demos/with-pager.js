define([], function () {
  return {
    title: '带分页',
    file: 'with-pager',
    demo: function () {
      const demo = this

      function getData(pageIndex) {
        demo.refs.table.loading()
        fetch(`https://randomuser.me/api?results=10&page=${pageIndex}`, { mode: 'cors' })
          .then((res) => res.json())
          .then(function (data) {
            demo.refs.table.update({ data: data.results })
            demo.refs.pager.update({ totalCount: 200, pageIndex: pageIndex })
          })
      }
      return {
        children: [
          {
            component: 'Table',
            ref: 'table',
            columns: [
              {
                field: 'name.first',
                title: 'Name',
                width: 200,
              },
              {
                field: 'gender',
                title: 'Gender',
              },
              {
                field: 'email',
                title: 'Email',
                width: 500,
              },
            ],
          },
          {
            component: 'Pager',
            ref: 'pager',
            onPageChange: function (params) {
              getData(params.pageIndex)
            },
          },
        ],
        _render: function () {
          getData(1)
        },
      }
    },
  }
})
