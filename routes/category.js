class Category{
	constructor(name){
		this.name = name;
		this.list = [];
	}

	count(word){
		var wordCount = 0;
		for(var i=0;i<this.list.length;i++){
			if(this.list[i]==word){
				wordCount++;
			}
		}
		return wordCount;
	}

	probability(sentence, uniqueWords){
		var words = sentence.trim().split(' ');
		var probability = 1;
		for(var i=0;i<words.length;i++){
			var wordProb = (this.count(words[i])+1)/(this.list.length+uniqueWords);
			probability*=wordProb;
		}
		probability*=this.list.length;
		return probability;
	}

}

module.exports = Category;