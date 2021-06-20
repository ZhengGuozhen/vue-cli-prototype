import Mock from "mockjs";

Mock.setup({
	timeout: "100-300"
});

Mock.mock(RegExp("/mock/test" + ".*"), "get", {
    code: 1000,
    data: 123
});

Mock.mock(RegExp("/mock/test" + ".*"), "post", (p) => {
    console.error('post body', JSON.parse(p.body))
    
	const data = Mock.mock({
		"list|20": [
			{
				id: "@id",
				nickname: "@name",
				createTime: "@datetime",
				text: "@cparagraph(1, 4)",
				content() {
					return JSON.stringify({ text: this.text });
				},
				contentType: 0,
				"type|0-1": 1
			}
		]
	});

	return {
		code: 1000,
		data: data
	};
});
