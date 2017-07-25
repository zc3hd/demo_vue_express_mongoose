
export const dev_state=(state)=>{
	// console.log(state,typeof state);
	if(state){
		return "已绑定";
	}
	else  {
		return "未绑定";
	}
}