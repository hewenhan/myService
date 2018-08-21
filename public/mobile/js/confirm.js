class ConfirmBox {
	constructor (config) {
		config = config || {};
		this.title = config.title || '';
		this.subTitle = config.subTitle || '';
		this.content = config.content || '';
		this.confirm = config.confirm || function () {console.log('confirmed')};
		this.cancel = config.cancel || function () {console.log('canceled')};
		this.boxId = new Date().getTime() + ConfirmBox.randomStr(5);
		var confirmDom = `
			<div id="confirmDom_${this.boxId}" class="confirmDom">
				<div class="confirmDomCover"></div>
				<div class="confirmDomBody">
					<div class="confirmDomBodyTitle"></div>
					<div class="confirmDomBodySubTitle"></div>
					<div class="confirmDomBodyContent"></div>
					<div class="confirmDomBodyBtn">
						<div class="confirmDomBtnGroup">
							<div class="confirmDomBodyCancelBtn">Cancel</div>
							<div class="confirmDomBodyConfirmBtn">Confirm</div>
						</div>
					</div>
				</div>
			</div>
		`;
		$('#head').append(confirmDom);

		this.$dom = $(`#confirmDom_${this.boxId}`);
		this.dom = $(`#confirmDom_${this.boxId}`)[0];

		this.createSetGroup();

		this.set.title(this.title);
		this.set.subTitle(this.subTitle);
		this.set.content(this.content);
		this.eventBind();
	}

	show () {
		this.$dom.addClass('confirmDomShow');
	}

	hidden () {
		this.$dom.removeClass('confirmDomShow');
	}

	confirm () {
		this.confirm();
	}

	createSetGroup () {
		var self = this;

		self.set = {};
		self.rander = {};

		self.set.title = (title) => {
			self.title = title;
			$(`#confirmDom_${self.boxId} .confirmDomBodyTitle`).html(self.title);
		};

		self.set.subTitle = (subTitle) => {
			self.subTitle = subTitle;
			$(`#confirmDom_${self.boxId} .confirmDomBodySubTitle`).html(self.subTitle);
		};

		self.set.content = (content) => {
			self.content = content;
			$(`#confirmDom_${self.boxId} .confirmDomBodyContent`).html(self.content);
		};
	}

	eventBind () {
		var self = this;

		$(`#confirmDom_${self.boxId} .confirmDomBodyConfirmBtn`).unbind();
		$(`#confirmDom_${self.boxId} .confirmDomBodyCancelBtn`).unbind();

		$(`#confirmDom_${self.boxId} .confirmDomBodyConfirmBtn`).bind('click', (e) => {
			self.confirm(e, () => {
				self.hidden();
			});
		});

		$(`#confirmDom_${self.boxId} .confirmDomBodyCancelBtn`).bind('click', (e) => {
			self.cancel(e);
			self.hidden();
		});

		$(`#confirmDom_${self.boxId} .confirmDomCover`).bind('click', (e) => {
			self.hidden();
		});
	}

	static randomStr (length) {
		var length = parseInt(length);
		var str = '';
		if (length / 25 >= 1) {
			for (var i = 0; i < Math.floor(length / 25); i++) {
				str += Math.random().toString(36).substr(2, 25);
			}
		}
		str += Math.random().toString(36).substr(2, length % 25);
		return str;
	}
}
