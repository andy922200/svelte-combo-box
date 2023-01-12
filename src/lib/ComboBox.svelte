<script lang="ts">
import county from '../assets/county.json'
let input = ''
let selectedValue = []
let status = 'blur'
$: filteredData = county.data
    .filter(item=> !selectedValue.find((k: Record<'name'|'param', string>)=> k.param === item.param))
    .filter(item=> item.name.includes(input))

const pushIntoSelectedValue = (item: Record<'name'|'param', string>)=>{
    selectedValue = Object.values(
        [...selectedValue, item]
            .reduce((acc:Record<'name'|'param', string>, cur:Record<'name'|'param', string>)=> ({...acc, [cur.param]: cur}), {})
    )
}
</script>

<div class="combo-box__wrapper">
    <div class="combo-box__input-wrapper">
        {#each selectedValue as tag}
            <button class="combo-box__input-tag">
                {tag.name}
            </button>
        {/each}

        <input
            placeholder="Please enter keywords"
            type="text"
            class="combo-box__input"
            bind:value={input}
            on:focus={()=> status = 'focus'}
            on:blur={()=> status = 'blur'}
        >
    </div>

    <div class="combo-box__dropdown">
        {#if filteredData.length > 0}
            <ul>
                {#each filteredData as county}
                    <li on:mousedown={()=> pushIntoSelectedValue(county)}>{county.name}</li>
                {/each}
            </ul>
        {:else if filteredData.length === 0}
            <span> 無資料 </span>
        {/if}
    </div>
</div>

<style lang="scss">
* {
    box-sizing: border-box;
}

.combo-box__wrapper{
    width: 100%;
}

.combo-box__input-wrapper{
    display: flex;
    width: 100%;
    max-width: 768px;
    border: 1px solid black;
    flex-wrap: wrap;

    .combo-box__input{
        padding: 8px;
        margin: 4px;
        border: 0;
        flex: 1 0 auto;
    }

    .combo-box__input-tag{
        margin: 4px 0 4px 4px;
        min-width: 60px;
        max-width: 60px;
        flex: 1 1 60px;

        &:hover{
            cursor: url("https://i.stack.imgur.com/bUGV0.png");
        }
    }
}
</style>