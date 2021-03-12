<template>
	<view>
        <cart ref="cart"></cart>
    </view>
</template>

<script>
import cart from '@/components/cart/cart.vue'

	export default {
		components: {
			cart
		},
		computed:{
			
		},
		data() {
			return {
				
			}
		},
		
		onShow() {
            this.$refs.cart.getOrderList()
        },
        
    }
</script>

<style lang="scss">

</style>
