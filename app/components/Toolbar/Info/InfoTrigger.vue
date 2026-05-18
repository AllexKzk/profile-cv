<template>
  <DialogTrigger>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button v-spotlight variant="outline" class="text-neutral-400" size="icon-sm" :aria-label="$t('tools.about')">
            <Icon name="iconoir:info-circle" size="18" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {{ $t('tools.about') }}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </DialogTrigger>
</template>