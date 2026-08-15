find . -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.md' \) \
  -exec sed -i 's|\.\./shared|shared|g' {} +