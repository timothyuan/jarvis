var Category = require('./category.js')

class Classifier{
	constructor(){
		this.array = [];
		this.uniqueArray = [];
	}

	find(word){
		for(var i=0;i<this.array.length;i++){
			if(this.array[i].name==word){
				return i;
			}
		}
		return -1;
	}

	train(sentence, category){
		var index = this.find(category);
		var split = sentence.trim().split(' ');
		if(index==-1){ 
			index = this.array.push(new Category(category))-1;
		}
		for(var i=0;i<split.length;i++){
			this.array[index].list.push(split[i]);
			if(this.uniqueArray.indexOf(split[i])==-1){
				this.uniqueArray.push(split[i]);
			}
		}
	}

	classify(sentence){
		var maxProb = 0;
		var category = '';
		for(var i=0;i<this.array.length;i++){
			var currentProb = this.array[i].probability(sentence, this.uniqueArray.length);
			//console.log(currentProb);
			if(currentProb>maxProb){
				maxProb = currentProb;
				category = this.array[i].name;
			}
		}
		return category;
	}
}

module.exports = Classifier;