# rotki/action-env

> An action that loads a .env as a job step.

## Usage

### Basic

```yaml
    steps:
      - uses: actions/checkout@v3
      - name: Run
        uses: rotki/action-env@v1      
        with:
          env_file: .github/.env
      - name: Echo plugin output
        run: | 
          echo "EXAMPLE: $EXAMPLE"    
```